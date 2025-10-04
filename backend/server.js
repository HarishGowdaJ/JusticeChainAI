// backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
require('dotenv').config();

const connectDB = require('./config/database');

// Import routes with error handling for missing files
let authRoutes, complaintRoutes, firRoutes, caseFileRoutes, notificationRoutes;
try { 
  authRoutes = require('./routes/auth'); 
} catch (e) { 
  console.warn('auth routes missing:', e.message); 
  authRoutes = null; 
}
try { 
  complaintRoutes = require('./routes/complaints'); 
} catch (e) { 
  console.warn('complaint routes missing:', e.message); 
  complaintRoutes = null; 
}
try { 
  firRoutes = require('./routes/firs'); 
} catch (e) { 
  console.warn('firs routes missing:', e.message); 
  firRoutes = null; 
}
try { 
  caseFileRoutes = require('./routes/casefiles'); 
} catch (e) { 
  console.warn('casefiles routes missing:', e.message); 
  caseFileRoutes = null; 
}
try { 
  notificationRoutes = require('./routes/notifications'); 
} catch (e) { 
  console.warn('notification routes missing:', e.message); 
  notificationRoutes = null; 
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"]
  }
});

// Connect to MongoDB
try {
  connectDB();
  console.log('MongoDB connection initiated');
} catch (e) {
  console.warn('connectDB failed - continuing:', e.message);
}

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files - general uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve anomaly detection annotated outputs
const anomalyUploadsPath = path.join(__dirname, 'anomaly', 'uploads');
if (!fs.existsSync(anomalyUploadsPath)) {
  fs.mkdirSync(anomalyUploadsPath, { recursive: true });
}
app.use('/anomaly_uploads', express.static(anomalyUploadsPath));

// Make io accessible to routes
app.set('io', io);

// Mount routes if they exist
if (authRoutes) app.use('/api/auth', authRoutes);
if (complaintRoutes) app.use('/api/complaints', complaintRoutes);
if (firRoutes) app.use('/api/firs', firRoutes);
if (caseFileRoutes) app.use('/api/casefiles', caseFileRoutes);
if (notificationRoutes) app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to role-based room
  socket.on('join', (userData) => {
    if (userData.role) {
      socket.join(userData.role);
      console.log(`User ${socket.id} joined ${userData.role} room`);
    }
  });

  // Join user to specific user room for personal notifications
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${socket.id} joined personal room for user ${userId}`);
  });

  // Handle notification read status
  socket.on('mark-notification-read', async (notificationId) => {
    try {
      const Notification = require('./models/Notification');
      await Notification.findByIdAndUpdate(notificationId, { isRead: true });
      socket.emit('notification-read', notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.broadcast.to(data.room).emit('user-typing', {
      userId: data.userId,
      isTyping: data.isTyping
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// ==================== ANOMALY DETECTION ENDPOINTS ====================

// Multer setup for temporary file uploads
const tempUploadDir = path.join(__dirname, 'tmp_uploads');
if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempUploadDir),
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}_${file.originalname.replace(/[^a-z0-9.\-_]/gi, '_')}`;
    cb(null, safeName);
  }
});
const upload = multer({ storage });

// Helper: Forward file to FastAPI endpoint
async function forwardFileToFastAPI(fastapiUrl, filePath, originalName) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath), { filename: originalName });

  const headers = form.getHeaders();
  const resp = await axios.post(fastapiUrl, form, {
    headers,
    responseType: 'stream',
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    timeout: 120000
  });
  return resp;
}

// Helper: Stream axios response to express response
function streamAxiosResponseToExpress(axiosResp, expressRes) {
  const contentType = axiosResp.headers['content-type'] || 'application/octet-stream';
  expressRes.setHeader('content-type', contentType);
  
  if (axiosResp.headers['content-length']) {
    expressRes.setHeader('content-length', axiosResp.headers['content-length']);
  }
  if (axiosResp.headers['content-disposition']) {
    expressRes.setHeader('content-disposition', axiosResp.headers['content-disposition']);
  }

  axiosResp.data.pipe(expressRes);
}

// POST /api/anomaly/upload -> Forward to FastAPI /predict
app.post('/api/anomaly/upload', upload.single('file'), async (req, res) => {
  try {
    const fastapi = process.env.FASTAPI_URL || process.env.FASTAPI_BASE || 'http://127.0.0.1:8000';
    const target = `${fastapi.replace(/\/$/, '')}/predict`;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Forwarding upload to FastAPI /predict:', req.file.path);
    const fastResp = await forwardFileToFastAPI(target, req.file.path, req.file.originalname);

    const contentType = (fastResp.headers['content-type'] || '').toLowerCase();
    if (contentType.includes('application/json') || contentType.includes('text/')) {
      const chunks = [];
      for await (const chunk of fastResp.data) chunks.push(chunk);
      const text = Buffer.concat(chunks).toString('utf8');
      
      try {
        const json = JSON.parse(text);
        res.status(fastResp.status).json(json);
      } catch (e) {
        res.status(fastResp.status).send(text);
      }
    } else {
      streamAxiosResponseToExpress(fastResp, res);
    }
  } catch (err) {
    console.error('Error forwarding /api/anomaly/upload:', err.message || err);
    res.status(500).json({ error: err.message || String(err) });
  } finally {
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
    }
  }
});

// POST /api/anomaly/weapon -> Forward to FastAPI weapon detection
app.post('/api/anomaly/weapon', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fastapi = process.env.FASTAPI_URL || process.env.FASTAPI_BASE || 'http://127.0.0.1:8000';
    const candidates = [
      `${fastapi.replace(/\/$/, '')}/predict/weapon`,
      `${fastapi.replace(/\/$/, '')}/predict?task=weapon`,
      `${fastapi.replace(/\/$/, '')}/predict`
    ];
    
    let lastErr = null;
    for (const target of candidates) {
      try {
        console.log(`Proxying /api/anomaly/weapon -> ${target}`);
        const fastResp = await forwardFileToFastAPI(target, req.file.path, req.file.originalname);

        const ct = (fastResp.headers['content-type'] || '').toLowerCase();
        if (ct.includes('application/json') || ct.includes('text/')) {
          const chunks = [];
          for await (const chunk of fastResp.data) chunks.push(chunk);
          const text = Buffer.concat(chunks).toString('utf8');
          
          try {
            const json = JSON.parse(text);
            res.status(fastResp.status).json(json);
          } catch (e) {
            res.status(fastResp.status).send(text);
          }
          return;
        } else {
          streamAxiosResponseToExpress(fastResp, res);
          return;
        }
      } catch (err) {
        console.warn('Forward attempt failed for', target, err.message || err);
        lastErr = err;
      }
    }
    
    console.error('All forward attempts failed for weapon:', lastErr && lastErr.message);
    res.status(502).json({ error: 'All backend attempts failed', info: lastErr && lastErr.message });
  } catch (err) {
    console.error('Error in /api/anomaly/weapon:', err);
    res.status(500).json({ error: err.message || String(err) });
  } finally {
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
    }
  }
});

// POST /api/anomaly/shoplifting -> Forward to FastAPI shoplifting detection
app.post('/api/anomaly/shoplifting', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fastapi = process.env.FASTAPI_URL || process.env.FASTAPI_BASE || 'http://127.0.0.1:8000';
    const candidates = [
      `${fastapi.replace(/\/$/, '')}/predict/shoplifting`,
      `${fastapi.replace(/\/$/, '')}/predict?task=shoplifting`,
      `${fastapi.replace(/\/$/, '')}/predict`
    ];
    
    let lastErr = null;
    for (const target of candidates) {
      try {
        console.log(`Proxying /api/anomaly/shoplifting -> ${target}`);
        const fastResp = await forwardFileToFastAPI(target, req.file.path, req.file.originalname);

        const ct = (fastResp.headers['content-type'] || '').toLowerCase();
        if (ct.includes('application/json') || ct.includes('text/')) {
          const chunks = [];
          for await (const chunk of fastResp.data) chunks.push(chunk);
          const text = Buffer.concat(chunks).toString('utf8');
          
          try {
            const json = JSON.parse(text);
            res.status(fastResp.status).json(json);
          } catch (e) {
            res.status(fastResp.status).send(text);
          }
          return;
        } else {
          streamAxiosResponseToExpress(fastResp, res);
          return;
        }
      } catch (err) {
        console.warn('Forward attempt failed for', target, err.message || err);
        lastErr = err;
      }
    }
    
    console.error('All forward attempts failed for shoplifting:', lastErr && lastErr.message);
    res.status(502).json({ error: 'All backend attempts failed', info: lastErr && lastErr.message });
  } catch (err) {
    console.error('Error in /api/anomaly/shoplifting:', err);
    res.status(500).json({ error: err.message || String(err) });
  } finally {
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
    }
  }
});

// ==================== ERROR HANDLING ====================

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    msg: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

// ==================== SERVER STARTUP ====================

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  const fastapi = process.env.FASTAPI_URL || process.env.FASTAPI_BASE || 'http://127.0.0.1:8000';
  console.log(`FastAPI URL: ${fastapi}`);
  console.log(`Anomaly uploads dir: ${anomalyUploadsPath}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});