const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const CaseFile = require('../models/CaseFile');
const FIR = require('../models/FIR');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Configure multer for case document uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/casefiles/';
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
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  }
});

// @route   POST /api/casefiles
// @desc    Create a new case file
// @access  Private (Court)
router.post('/', auth, upload.array('documents', 10), [
  body('firId').notEmpty().withMessage('FIR ID is required'),
  body('caseDetails').isLength({ min: 20 }).withMessage('Case details must be at least 20 characters'),
  body('caseType').isIn(['criminal', 'civil', 'family', 'commercial', 'constitutional'])
    .withMessage('Invalid case type'),
  body('judgeName').notEmpty().withMessage('Judge name is required'),
  body('publicProsecutor').notEmpty().withMessage('Public prosecutor is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    if (user.role !== 'court' && user.role !== 'police') {
      return res.status(403).json({ msg: 'Only court officials and police officers can create case files' });
    }

    const {
      firId,
      caseDetails,
      caseType,
      judgeName,
      publicProsecutor,
      charges = [],
      accusedDetails = [],
      nextHearingDate
    } = req.body;

    // Check if FIR exists
    const fir = await FIR.findById(firId);
    if (!fir) {
      return res.status(404).json({ msg: 'FIR not found' });
    }

    // Check if case file already exists for this FIR
    const existingCase = await CaseFile.findOne({ firId });
    if (existingCase) {
      return res.status(400).json({ msg: 'Case file already exists for this FIR' });
    }

    // Generate case number
    const caseCount = await CaseFile.countDocuments();
    const caseNumber = `CASE-${new Date().getFullYear()}-${String(caseCount + 1).padStart(4, '0')}`;

    // Prepare documents data
    const documents = req.files ? req.files.map(file => ({
      type: 'case_document',
      filename: file.filename,
      originalName: file.originalname,
      path: file.path
    })) : [];

    const caseFile = new CaseFile({
      caseNumber,
      firId,
      complaintId: fir.complaintId,
      courtName: user.role === 'court' ? user.courtName : 'District Court', // Default court for police
      judgeName,
      publicProsecutor,
      caseType,
      caseDetails,
      charges,
      accusedDetails,
      documents,
      nextHearingDate: nextHearingDate ? new Date(nextHearingDate) : null
    });

    await caseFile.save();

    // Update FIR status
    fir.status = 'case_filed';
    await fir.save();

    // Update complaint status
    const complaint = await Complaint.findById(fir.complaintId);
    complaint.status = 'case_filed';
    complaint.caseNumber = caseNumber;
    await complaint.save();

    // Create notification for citizen
    const citizenNotification = new Notification({
      recipientId: complaint.citizenId,
      recipientRole: 'citizen',
      type: 'case_filed',
      title: 'Case File Generated',
      message: `Case file ${caseNumber} has been generated for your complaint`,
      relatedId: caseFile._id,
      relatedType: 'case',
      priority: 'high'
    });

    await citizenNotification.save();

    // Create notification for police
    const policeNotification = new Notification({
      recipientId: fir.investigatingOfficer,
      recipientRole: 'police',
      type: 'case_filed',
      title: 'Case File Generated',
      message: `Case file ${caseNumber} has been generated for FIR ${fir.firNumber}`,
      relatedId: caseFile._id,
      relatedType: 'case',
      priority: 'medium'
    });

    await policeNotification.save();

    // Emit real-time notifications
    req.app.get('io').emit('caseFiled', {
      caseId: caseFile._id,
      caseNumber,
      firId,
      complaintId: complaint._id,
      citizenId: complaint.citizenId,
      timestamp: new Date()
    });

    res.status(201).json({
      msg: 'Case file created successfully',
      caseFile: {
        id: caseFile._id,
        caseNumber: caseFile.caseNumber,
        status: caseFile.caseStatus,
        filedDate: caseFile.filedDate
      }
    });

  } catch (error) {
    console.error('Error creating case file:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/casefiles
// @desc    Get all case files (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let query = {};

    // Filter based on user role
    if (user.role === 'court') {
      // Court can see all case files
    } else if (user.role === 'citizen') {
      // Citizens can see case files for their complaints
      const userComplaints = await Complaint.find({ citizenId: req.user.id });
      const complaintIds = userComplaints.map(complaint => complaint._id);
      query.complaintId = { $in: complaintIds };
    } else if (user.role === 'police') {
      // Police can see case files for their FIRs
      const userFIRs = await FIR.find({ investigatingOfficer: req.user.id });
      const firIds = userFIRs.map(fir => fir._id);
      query.firId = { $in: firIds };
    }

    const caseFiles = await CaseFile.find(query)
      .populate('firId', 'firNumber policeStation investigatingOfficer')
      .populate('complaintId', 'citizenName complaintType description')
      .sort({ filedDate: -1 });

    res.json(caseFiles);
  } catch (error) {
    console.error('Error fetching case files:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/casefiles/:id
// @desc    Get case file by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const caseFile = await CaseFile.findById(req.params.id)
      .populate('firId', 'firNumber policeStation investigatingOfficer')
      .populate('complaintId', 'citizenName complaintType description citizenId');

    if (!caseFile) {
      return res.status(404).json({ msg: 'Case file not found' });
    }

    // Check access permissions
    if (user.role === 'citizen') {
      const complaint = await Complaint.findById(caseFile.complaintId._id);
      if (complaint.citizenId.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Access denied' });
      }
    } else if (user.role === 'police') {
      const fir = await FIR.findById(caseFile.firId._id);
      if (fir.investigatingOfficer.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Access denied' });
      }
    }

    res.json(caseFile);
  } catch (error) {
    console.error('Error fetching case file:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/casefiles/:id/status
// @desc    Update case file status
// @access  Private (Court)
router.put('/:id/status', auth, [
  body('status').isIn(['filed', 'hearing', 'judgment', 'appealed', 'closed'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    if (user.role !== 'court') {
      return res.status(403).json({ msg: 'Only court officials can update case status' });
    }

    const { status } = req.body;
    const caseFile = await CaseFile.findById(req.params.id);

    if (!caseFile) {
      return res.status(404).json({ msg: 'Case file not found' });
    }

    caseFile.caseStatus = status;
    await caseFile.save();

    // Create notification for citizen and police
    const complaint = await Complaint.findById(caseFile.complaintId);
    const fir = await FIR.findById(caseFile.firId);

    const notifications = [
      new Notification({
        recipientId: complaint.citizenId,
        recipientRole: 'citizen',
        type: 'status_update',
        title: 'Case Status Updated',
        message: `Case ${caseFile.caseNumber} status has been updated to: ${status}`,
        relatedId: caseFile._id,
        relatedType: 'case'
      }),
      new Notification({
        recipientId: fir.investigatingOfficer,
        recipientRole: 'police',
        type: 'status_update',
        title: 'Case Status Updated',
        message: `Case ${caseFile.caseNumber} status has been updated to: ${status}`,
        relatedId: caseFile._id,
        relatedType: 'case'
      })
    ];

    await Notification.insertMany(notifications);

    res.json({ msg: 'Case status updated successfully', caseFile });
  } catch (error) {
    console.error('Error updating case status:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/casefiles/:id/hearings
// @desc    Schedule a hearing
// @access  Private (Court)
router.post('/:id/hearings', auth, [
  body('date').isISO8601().withMessage('Valid hearing date is required'),
  body('purpose').notEmpty().withMessage('Hearing purpose is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    if (user.role !== 'court') {
      return res.status(403).json({ msg: 'Only court officials can schedule hearings' });
    }

    const { date, purpose, notes = '' } = req.body;
    const caseFile = await CaseFile.findById(req.params.id);

    if (!caseFile) {
      return res.status(404).json({ msg: 'Case file not found' });
    }

    const hearing = {
      date: new Date(date),
      purpose,
      status: 'scheduled',
      notes
    };

    caseFile.hearingDates.push(hearing);
    caseFile.nextHearingDate = new Date(date);
    await caseFile.save();

    // Create notification for citizen and police
    const complaint = await Complaint.findById(caseFile.complaintId);
    const fir = await FIR.findById(caseFile.firId);

    const notifications = [
      new Notification({
        recipientId: complaint.citizenId,
        recipientRole: 'citizen',
        type: 'hearing_scheduled',
        title: 'Hearing Scheduled',
        message: `Hearing scheduled for case ${caseFile.caseNumber} on ${new Date(date).toLocaleDateString()}`,
        relatedId: caseFile._id,
        relatedType: 'case',
        priority: 'high'
      }),
      new Notification({
        recipientId: fir.investigatingOfficer,
        recipientRole: 'police',
        type: 'hearing_scheduled',
        title: 'Hearing Scheduled',
        message: `Hearing scheduled for case ${caseFile.caseNumber} on ${new Date(date).toLocaleDateString()}`,
        relatedId: caseFile._id,
        relatedType: 'case',
        priority: 'high'
      })
    ];

    await Notification.insertMany(notifications);

    res.json({ msg: 'Hearing scheduled successfully', caseFile });
  } catch (error) {
    console.error('Error scheduling hearing:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/casefiles/:id/judgment
// @desc    Record judgment
// @access  Private (Court)
router.post('/:id/judgment', auth, [
  body('verdict').isIn(['guilty', 'not_guilty', 'acquitted', 'convicted'])
    .withMessage('Invalid verdict'),
  body('judgmentText').isLength({ min: 20 }).withMessage('Judgment text must be at least 20 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    if (user.role !== 'court') {
      return res.status(403).json({ msg: 'Only court officials can record judgments' });
    }

    const { verdict, sentence = '', fine = 0, judgmentText } = req.body;
    const caseFile = await CaseFile.findById(req.params.id);

    if (!caseFile) {
      return res.status(404).json({ msg: 'Case file not found' });
    }

    caseFile.judgment = {
      verdict,
      sentence,
      fine,
      judgmentDate: new Date(),
      judgmentText
    };

    caseFile.caseStatus = 'judgment';
    await caseFile.save();

    // Update complaint status to resolved
    const complaint = await Complaint.findById(caseFile.complaintId);
    complaint.status = 'resolved';
    await complaint.save();

    // Create notification for citizen and police
    const fir = await FIR.findById(caseFile.firId);

    const notifications = [
      new Notification({
        recipientId: complaint.citizenId,
        recipientRole: 'citizen',
        type: 'status_update',
        title: 'Judgment Delivered',
        message: `Judgment delivered for case ${caseFile.caseNumber}. Verdict: ${verdict}`,
        relatedId: caseFile._id,
        relatedType: 'case',
        priority: 'high'
      }),
      new Notification({
        recipientId: fir.investigatingOfficer,
        recipientRole: 'police',
        type: 'status_update',
        title: 'Judgment Delivered',
        message: `Judgment delivered for case ${caseFile.caseNumber}. Verdict: ${verdict}`,
        relatedId: caseFile._id,
        relatedType: 'case',
        priority: 'high'
      })
    ];

    await Notification.insertMany(notifications);

    res.json({ msg: 'Judgment recorded successfully', caseFile });
  } catch (error) {
    console.error('Error recording judgment:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/casefiles/search/:caseNumber
// @desc    Search case file by case number
// @access  Private
router.get('/search/:caseNumber', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const caseFile = await CaseFile.findOne({ caseNumber: req.params.caseNumber })
      .populate('firId', 'firNumber policeStation investigatingOfficer')
      .populate('complaintId', 'citizenName complaintType description citizenId');

    if (!caseFile) {
      return res.status(404).json({ msg: 'Case file not found' });
    }

    // Check access permissions
    if (user.role === 'citizen') {
      const complaint = await Complaint.findById(caseFile.complaintId._id);
      if (complaint.citizenId.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Access denied' });
      }
    } else if (user.role === 'police') {
      const fir = await FIR.findById(caseFile.firId._id);
      if (fir.investigatingOfficer.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Access denied' });
      }
    }

    res.json(caseFile);
  } catch (error) {
    console.error('Error searching case file:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
