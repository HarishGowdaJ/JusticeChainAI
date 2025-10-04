const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const { addCase } = require('../blockchain/index'); // Blockchain interaction module
const crypto = require('crypto');

// Helper function to create SHA256 hash of complaint data
function createDataHash(description, incidentDate, citizenId) {
  const str = description + incidentDate.toISOString() + citizenId.toString();
  return crypto.createHash('sha256').update(str).digest('hex');
}

// Test endpoint (no auth required)
router.get('/test', (req, res) => {
  res.json({ msg: 'Complaints route is working' });
});

// Test complaint creation (no auth required) - for debugging
router.post('/test-create', async (req, res) => {
  try {
    console.log('Test complaint creation:', req.body);

    // Test if we can create a complaint without auth
    const testComplaint = new Complaint({
      citizenId: '507f1f77bcf86cd799439011', // Dummy ObjectId
      citizenName: 'Test User',
      citizenEmail: 'test@example.com',
      citizenPhone: '1234567890',
      complaintType: 'criminal',
      description: 'Test complaint description',
      location: 'Test Location',
      incidentDate: new Date(),
      evidence: [],
      priority: 'medium'
    });

    await testComplaint.save();
    console.log('Test complaint saved successfully');
    res.json({ msg: 'Test complaint created successfully', complaint: testComplaint });
  } catch (error) {
    console.error('Test complaint creation error:', error);
    res.status(500).json({ msg: 'Test complaint creation failed', error: error.message });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/complaints/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  }
});

// @route   POST /api/complaints
// @desc    Register a new complaint
// @access  Private (Citizen)
router.post('/', auth, upload.array('evidence', 5), async (req, res) => {
  try {
    console.log('Complaint submission received:', {
      body: req.body,
      files: req.files,
      user: req.user
    });

    // Manual validation
    const { complaintType, description, location, incidentDate } = req.body;

    if (!complaintType) {
      return res.status(400).json({ msg: 'Complaint type is required' });
    }
    if (!description || description.length < 10) {
      return res.status(400).json({ msg: 'Description must be at least 10 characters' });
    }
    if (!location) {
      return res.status(400).json({ msg: 'Location is required' });
    }
    if (!incidentDate) {
      return res.status(400).json({ msg: 'Incident date is required' });
    }

    console.log('Looking up user:', req.user.id);
    const user = await User.findById(req.user.id);
    console.log('User found:', user ? { id: user._id, role: user.role, name: user.name } : 'Not found');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    if (user.role !== 'citizen') {
      return res.status(403).json({ msg: 'Only citizens can file complaints' });
    }

    const {
      priority = 'medium'
    } = req.body;

    console.log('Creating complaint with data:', {
      citizenId: req.user.id,
      citizenName: user.name,
      citizenEmail: user.email,
      complaintType,
      description: description.substring(0, 50) + '...',
      location,
      incidentDate,
      incidentDateType: typeof incidentDate
    });

    // Prepare evidence data
    const evidence = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path
    })) : [];

    console.log('Evidence files:', evidence);

    // Ensure incidentDate is a proper Date object
    const formattedIncidentDate = new Date(incidentDate);
    if (isNaN(formattedIncidentDate.getTime())) {
      return res.status(400).json({ msg: 'Invalid incident date format' });
    }

    const complaint = new Complaint({
      citizenId: req.user.id,
      citizenName: user.name,
      citizenEmail: user.email,
      citizenPhone: user.phone,
      complaintType,
      description,
      location,
      incidentDate: formattedIncidentDate,
      evidence,
      priority
    });

    console.log('Saving complaint...');
    await complaint.save();
    console.log('Complaint saved with ID:', complaint._id);

    // Blockchain integration - add case reference
    try {
      const caseId = complaint._id.toString();
      const dataHash = createDataHash(complaint.description, complaint.incidentDate, complaint.citizenId);

      await addCase(caseId, dataHash);
      console.log('Complaint successfully recorded on blockchain:', caseId);
    } catch (blockchainError) {
      console.error('Failed to record complaint on blockchain:', blockchainError);
      // Decide if you want to fail request or just log error (logged here)
    }

    // Create notification for police
    try {
      const policeUsers = await User.find({ role: 'police' });
      console.log('Found police users:', policeUsers.length);
      
      if (policeUsers.length > 0) {
        const notifications = policeUsers.map(police => new Notification({
          recipientId: police._id,
          recipientRole: 'police',
          type: 'complaint_registered',
          title: 'New Complaint Registered',
          message: `A new ${complaintType} complaint has been registered by ${user.name}`,
          relatedId: complaint._id,
          relatedType: 'complaint',
          priority: priority === 'urgent' ? 'urgent' : 'high'
        }));

        await Notification.insertMany(notifications);
        console.log('Notifications created for police users');
      } else {
        console.log('No police users found, skipping notification creation');
      }
    } catch (notificationError) {
      console.error('Error creating notifications:', notificationError);
      // Don't fail the complaint creation if notifications fail
    }

    // Emit real-time notification
    try {
      req.app.get('io').emit('newComplaint', {
        complaintId: complaint._id,
        citizenName: user.name,
        complaintType,
        priority,
        timestamp: new Date()
      });
      console.log('Real-time notification emitted');
    } catch (socketError) {
      console.error('Error emitting real-time notification:', socketError);
      // Don't fail the complaint creation if socket emission fails
    }

    res.status(201).json({
      msg: 'Complaint registered successfully',
      complaint: {
        id: complaint._id,
        complaintType: complaint.complaintType,
        status: complaint.status,
        createdAt: complaint.createdAt
      }
    });

  } catch (error) {
    console.error('Error registering complaint:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// Remaining existing routes below left unchanged ...

// @route   GET /api/complaints
// @desc    Get all complaints (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let query = {};

    // Filter based on user role
    if (user.role === 'citizen') {
      query.citizenId = req.user.id;
    } else if (user.role === 'police') {
      if (req.query.assigned === 'true') {
        query.assignedOfficer = req.user.id;
      }
    } else if (user.role === 'court') {
      query.status = { $in: ['case_filed', 'resolved'] };
    }

    const complaints = await Complaint.find(query)
      .populate('citizenId', 'name email phone')
      .populate('assignedOfficer', 'name badgeNumber')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/complaints/:id
// @desc    Get complaint by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizenId', 'name email phone')
      .populate('assignedOfficer', 'name badgeNumber policeStation');

    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }

    if (user.role === 'citizen' && complaint.citizenId._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/complaints/:id/assign
// @desc    Assign complaint to police officer
// @access  Private (Police)
router.put('/:id/assign', auth, [
  body('assignedOfficer').notEmpty().withMessage('Officer assignment is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    if (user.role !== 'police') {
      return res.status(403).json({ msg: 'Only police can assign complaints' });
    }

    const { assignedOfficer, assignedPoliceStation } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }

    complaint.assignedOfficer = assignedOfficer;
    complaint.assignedPoliceStation = assignedPoliceStation;
    complaint.status = 'under_review';
    await complaint.save();

    const notification = new Notification({
      recipientId: assignedOfficer,
      recipientRole: 'police',
      type: 'complaint_registered',
      title: 'Complaint Assigned',
      message: `You have been assigned a new complaint (${complaint.complaintType})`,
      relatedId: complaint._id,
      relatedType: 'complaint',
      priority: 'high'
    });

    await notification.save();

    res.json({ msg: 'Complaint assigned successfully', complaint });
  } catch (error) {
    console.error('Error assigning complaint:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/complaints/:id/status
// @desc    Update complaint status
// @access  Private
router.put('/:id/status', auth, [
  body('status').isIn(['pending', 'under_review', 'fir_filed', 'case_filed', 'resolved'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }

    complaint.status = status;
    await complaint.save();

    const notification = new Notification({
      recipientId: complaint.citizenId,
      recipientRole: 'citizen',
      type: 'status_update',
      title: 'Complaint Status Updated',
      message: `Your complaint status has been updated to: ${status}`,
      relatedId: complaint._id,
      relatedType: 'complaint'
    });

    await notification.save();

    res.json({ msg: 'Status updated successfully', complaint });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
