<<<<<<< HEAD
=======
// server.js (complete replacement)
// Keeps all your original functionality and adds anomaly detection routes
>>>>>>> 30dfe99 (Anomaly1)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
<<<<<<< HEAD
=======
const fs = require('fs');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
>>>>>>> 30dfe99 (Anomaly1)
require('dotenv').config();

const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const firRoutes = require('./routes/firs');
const caseFileRoutes = require('./routes/casefiles');
const notificationRoutes = require('./routes/notifications');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
<<<<<<< HEAD
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
=======
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
>>>>>>> 30dfe99 (Anomaly1)
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
<<<<<<< HEAD
  origin: process.env.CLIENT_URL || "http://localhost:3000",
=======
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
>>>>>>> 30dfe99 (Anomaly1)
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/firs', firRoutes);
app.use('/api/casefiles', caseFileRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
<<<<<<< HEAD
  res.json({ 
    status: 'OK', 
=======
  res.json({
    status: 'OK',
>>>>>>> 30dfe99 (Anomaly1)
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

<<<<<<< HEAD
=======
// ----------------------
// ANOMALY DETECTION ROUTES
// ----------------------
// Configuration: where FastAPI listens and where Node will temporarily store uploads
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';
const ANOMALY_UPLOAD_DIR = path.join(__dirname, 'anomaly_uploads'); // backend/anomaly_uploads
// If you prefer backend/anomaly/uploads (so uploads sit inside backend/anomaly), change as needed:
// const ANOMALY_UPLOAD_DIR = path.join(__dirname, 'anomaly', 'uploads');

if (!fs.existsSync(ANOMALY_UPLOAD_DIR)) {
  fs.mkdirSync(ANOMALY_UPLOAD_DIR, { recursive: true });
}

// multer setup: write uploaded files into ANOMALY_UPLOAD_DIR
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, ANOMALY_UPLOAD_DIR),
  filename: (req, file, cb) => {
    // Simple unique filename: timestamp-random-original
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}-${file.originalname}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// Helper: forward a saved file to FastAPI via multipart/form-data and return FastAPI response
async function forwardFileToFastAPI(fastApiPath, filePath, originalName, extraFields = {}) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath), originalName || path.basename(filePath));
  // append any extra fields (like conf, threshold) as string values
  for (const [k, v] of Object.entries(extraFields)) {
    if (v !== undefined && v !== null) form.append(k, String(v));
  }

  // Axios needs form headers
  const headers = form.getHeaders();

  // If FASTAPI is behind some auth, you can add headers here (Authorization etc.)
  const url = `${FASTAPI_URL}${fastApiPath}`;

  const response = await axios.post(url, form, {
    headers,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    timeout: 10 * 60 * 1000 // 10 minutes, adjust if models require more
  });

  return response.data;
}

// POST /api/anomaly/upload -> forwards to FastAPI /predict
app.post('/api/anomaly/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // extra fields optionally passed from client
    const { threshold, save_txt } = req.body;

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    try {
      const fastApiResp = await forwardFileToFastAPI('/predict', filePath, originalName, {
        threshold: threshold || undefined,
        save_txt: save_txt || undefined
      });

      // Optionally delete file after FastAPI responded
      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }

      return res.json(fastApiResp);
    } catch (err) {
      // If axios forwarded an error, include helpful information
      console.error('Error forwarding to FastAPI /predict:', err && err.response ? err.response.data || err.response.statusText : err.message || err);
      // Clean up file
      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }

      return res.status(500).json({ error: 'FastAPI /predict failed', details: err && err.response ? err.response.data : (err.message || String(err)) });
    }
  } catch (err) {
    console.error('/api/anomaly/upload error:', err);
    return res.status(500).json({ error: 'Server error', details: err.message || String(err) });
  }
});

// POST /api/anomaly/shoplifting -> forwards to FastAPI /predict/shoplifting
app.post('/api/anomaly/shoplifting', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { conf, save_txt } = req.body;
    const filePath = req.file.path;
    const originalName = req.file.originalname;

    try {
      const fastApiResp = await forwardFileToFastAPI('/predict/shoplifting', filePath, originalName, {
        conf: conf || undefined,
        save_txt: save_txt || undefined
      });

      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }

      return res.json(fastApiResp);
    } catch (err) {
      console.error('Error forwarding to FastAPI /predict/shoplifting:', err && err.response ? err.response.data || err.response.statusText : err.message || err);
      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      return res.status(500).json({ error: 'FastAPI /predict/shoplifting failed', details: err && err.response ? err.response.data : (err.message || String(err)) });
    }
  } catch (err) {
    console.error('/api/anomaly/shoplifting error:', err);
    return res.status(500).json({ error: 'Server error', details: err.message || String(err) });
  }
});

// POST /api/anomaly/weapon -> forwards to FastAPI /predict/weapon
app.post('/api/anomaly/weapon', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { conf, save_txt } = req.body;
    const filePath = req.file.path;
    const originalName = req.file.originalname;

    try {
      const fastApiResp = await forwardFileToFastAPI('/predict/weapon', filePath, originalName, {
        conf: conf || undefined,
        save_txt: save_txt || undefined
      });

      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }

      return res.json(fastApiResp);
    } catch (err) {
      console.error('Error forwarding to FastAPI /predict/weapon:', err && err.response ? err.response.data || err.response.statusText : err.message || err);
      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      return res.status(500).json({ error: 'FastAPI /predict/weapon failed', details: err && err.response ? err.response.data : (err.message || String(err)) });
    }
  } catch (err) {
    console.error('/api/anomaly/weapon error:', err);
    return res.status(500).json({ error: 'Server error', details: err.message || String(err) });
  }
});
// ----------------------
// End anomaly routes
// ----------------------

>>>>>>> 30dfe99 (Anomaly1)
// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to role-based room
  socket.on('join', (userData) => {
<<<<<<< HEAD
    if (userData.role) {
=======
    if (userData && userData.role) {
>>>>>>> 30dfe99 (Anomaly1)
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

  // Handle typing indicators (for future chat features)
  socket.on('typing', (data) => {
<<<<<<< HEAD
    socket.broadcast.to(data.room).emit('user-typing', {
      userId: data.userId,
      isTyping: data.isTyping
    });
=======
    if (data && data.room) {
      socket.broadcast.to(data.room).emit('user-typing', {
        userId: data.userId,
        isTyping: data.isTyping
      });
    }
>>>>>>> 30dfe99 (Anomaly1)
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
<<<<<<< HEAD
  console.error(err.stack);
  res.status(500).json({ 
    msg: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
=======
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({
    msg: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? (err && err.message ? err.message : String(err)) : 'Internal server error'
>>>>>>> 30dfe99 (Anomaly1)
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
<<<<<<< HEAD
=======
  console.log(`FastAPI URL: ${FASTAPI_URL}`);
  console.log(`Anomaly uploads dir: ${ANOMALY_UPLOAD_DIR}`);
>>>>>>> 30dfe99 (Anomaly1)
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
