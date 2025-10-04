const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const FIR = require('../models/FIR');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// @route   POST /api/firs
// @desc    File a new FIR
// @access  Private (Police)
router.post('/', auth, [
  body('complaintId').notEmpty().withMessage('Complaint ID is required'),
  body('firDetails').isLength({ min: 20 }).withMessage('FIR details must be at least 20 characters'),
  body('sections').isArray({ min: 1 }).withMessage('At least one section must be specified'),
  body('policeStation').notEmpty().withMessage('Police station is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    if (user.role !== 'police') {
      return res.status(403).json({ msg: 'Only police officers can file FIRs' });
    }

    const {
      complaintId,
      firDetails,
      sections,
      accusedDetails = [],
      witnessDetails = [],
      investigationNotes = []
    } = req.body;

    // Check if complaint exists and is assigned to this officer
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found' });
    }

    if (complaint.assignedOfficer && complaint.assignedOfficer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You are not assigned to this complaint' });
    }

    // Generate FIR number
    const firCount = await FIR.countDocuments();
    const firNumber = `FIR-${new Date().getFullYear()}-${String(firCount + 1).padStart(4, '0')}`;

    const fir = new FIR({
      firNumber,
      complaintId,
      policeStation: user.policeStation,
      investigatingOfficer: req.user.id,
      officerName: user.name,
      firDetails,
      sections,
      accusedDetails,
      witnessDetails,
      investigationNotes: investigationNotes.map(note => ({
        note,
        addedBy: req.user.id
      }))
    });

    await fir.save();

    // Update complaint status and FIR number
    complaint.status = 'fir_filed';
    complaint.firNumber = firNumber;
    complaint.assignedOfficer = req.user.id;
    complaint.assignedPoliceStation = user.policeStation;
    await complaint.save();

    // Create notification for citizen
    const citizenNotification = new Notification({
      recipientId: complaint.citizenId,
      recipientRole: 'citizen',
      type: 'fir_filed',
      title: 'FIR Filed',
      message: `FIR ${firNumber} has been filed for your complaint`,
      relatedId: fir._id,
      relatedType: 'fir',
      priority: 'high'
    });

    await citizenNotification.save();

    // Create notification for court
    const courtUsers = await User.find({ role: 'court' });
    const courtNotifications = courtUsers.map(court => new Notification({
      recipientId: court._id,
      recipientRole: 'court',
      type: 'fir_filed',
      title: 'New FIR Filed',
      message: `FIR ${firNumber} has been filed for ${complaint.complaintType} complaint`,
      relatedId: fir._id,
      relatedType: 'fir',
      priority: 'medium'
    }));

    await Notification.insertMany(courtNotifications);

    // Emit real-time notifications
    req.app.get('io').emit('firFiled', {
      firId: fir._id,
      firNumber,
      complaintId,
      citizenId: complaint.citizenId,
      timestamp: new Date()
    });

    res.status(201).json({
      msg: 'FIR filed successfully',
      fir: {
        id: fir._id,
        firNumber: fir.firNumber,
        status: fir.status,
        filedDate: fir.filedDate
      }
    });

  } catch (error) {
    console.error('Error filing FIR:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/firs
// @desc    Get all FIRs (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let query = {};

    // Filter based on user role
    if (user.role === 'police') {
      query.investigatingOfficer = req.user.id;
    } else if (user.role === 'court') {
      // Court can see all FIRs
    } else if (user.role === 'citizen') {
      // Citizens can see FIRs for their complaints
      const userComplaints = await Complaint.find({ citizenId: req.user.id });
      const complaintIds = userComplaints.map(complaint => complaint._id);
      query.complaintId = { $in: complaintIds };
    }

    const firs = await FIR.find(query)
      .populate('complaintId', 'citizenName complaintType description status')
      .populate('investigatingOfficer', 'name badgeNumber policeStation')
      .sort({ filedDate: -1 });

    res.json(firs);
  } catch (error) {
    console.error('Error fetching FIRs:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/firs/:id
// @desc    Get FIR by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const fir = await FIR.findById(req.params.id)
      .populate('complaintId', 'citizenName complaintType description status citizenId')
      .populate('investigatingOfficer', 'name badgeNumber policeStation');

    if (!fir) {
      return res.status(404).json({ msg: 'FIR not found' });
    }

    // Check access permissions
    if (user.role === 'citizen') {
      const complaint = await Complaint.findById(fir.complaintId._id);
      if (complaint.citizenId.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Access denied' });
      }
    } else if (user.role === 'police' && fir.investigatingOfficer._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    res.json(fir);
  } catch (error) {
    console.error('Error fetching FIR:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/firs/:id/status
// @desc    Update FIR status
// @access  Private (Police)
router.put('/:id/status', auth, [
  body('status').isIn(['filed', 'under_investigation', 'chargesheet_filed', 'case_filed', 'closed'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    if (user.role !== 'police') {
      return res.status(403).json({ msg: 'Only police officers can update FIR status' });
    }

    const { status } = req.body;
    const fir = await FIR.findById(req.params.id);

    if (!fir) {
      return res.status(404).json({ msg: 'FIR not found' });
    }

    if (fir.investigatingOfficer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You are not authorized to update this FIR' });
    }

    fir.status = status;
    await fir.save();

    // Update complaint status if FIR is closed
    if (status === 'closed') {
      const complaint = await Complaint.findById(fir.complaintId);
      complaint.status = 'resolved';
      await complaint.save();
    }

    // Create notification for citizen
    const complaint = await Complaint.findById(fir.complaintId);
    const notification = new Notification({
      recipientId: complaint.citizenId,
      recipientRole: 'citizen',
      type: 'status_update',
      title: 'FIR Status Updated',
      message: `FIR ${fir.firNumber} status has been updated to: ${status}`,
      relatedId: fir._id,
      relatedType: 'fir'
    });

    await notification.save();

    res.json({ msg: 'FIR status updated successfully', fir });
  } catch (error) {
    console.error('Error updating FIR status:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/firs/:id/investigation-notes
// @desc    Add investigation notes to FIR
// @access  Private (Police)
router.post('/:id/investigation-notes', auth, [
  body('note').isLength({ min: 10 }).withMessage('Note must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    if (user.role !== 'police') {
      return res.status(403).json({ msg: 'Only police officers can add investigation notes' });
    }

    const { note } = req.body;
    const fir = await FIR.findById(req.params.id);

    if (!fir) {
      return res.status(404).json({ msg: 'FIR not found' });
    }

    if (fir.investigatingOfficer.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You are not authorized to add notes to this FIR' });
    }

    fir.investigationNotes.push({
      note,
      addedBy: req.user.id
    });

    await fir.save();

    res.json({ msg: 'Investigation note added successfully', fir });
  } catch (error) {
    console.error('Error adding investigation note:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/firs/search/:firNumber
// @desc    Search FIR by FIR number
// @access  Private
router.get('/search/:firNumber', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const fir = await FIR.findOne({ firNumber: req.params.firNumber })
      .populate('complaintId', 'citizenName complaintType description citizenId')
      .populate('investigatingOfficer', 'name badgeNumber policeStation');

    if (!fir) {
      return res.status(404).json({ msg: 'FIR not found' });
    }

    // Check access permissions
    if (user.role === 'citizen') {
      const complaint = await Complaint.findById(fir.complaintId._id);
      if (complaint.citizenId.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Access denied' });
      }
    } else if (user.role === 'police' && fir.investigatingOfficer._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    res.json(fir);
  } catch (error) {
    console.error('Error searching FIR:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
