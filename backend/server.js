const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
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
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
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

  // Handle typing indicators (for future chat features)
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

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
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
