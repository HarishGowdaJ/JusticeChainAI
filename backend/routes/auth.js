const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('role').isIn(['citizen', 'police', 'court']).withMessage('Valid role is required'),
  body('policeStation').if(body('role').equals('police')).notEmpty().withMessage('Police station is required for police role'),
  body('badgeNumber').if(body('role').equals('police')).notEmpty().withMessage('Badge number is required for police role'),
  body('courtName').if(body('role').equals('court')).notEmpty().withMessage('Court name is required for court role'),
  body('designation').if(body('role').equals('court')).notEmpty().withMessage('Designation is required for court role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, role, policeStation, badgeNumber, courtName, designation } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      role,
      ...(role === 'police' && { policeStation, badgeNumber }),
      ...(role === 'court' && { courtName, designation })
    });

    await user.save();

    // Generate JWT token
    const payload = {
      id: user._id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '7d'
    });

    res.status(201).json({
      msg: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(role === 'police' && { policeStation: user.policeStation, badgeNumber: user.badgeNumber }),
        ...(role === 'court' && { courtName: user.courtName, designation: user.designation })
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(400).json({ msg: 'Account is deactivated' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const payload = {
      id: user._id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '7d'
    });

    res.json({
      msg: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(user.role === 'police' && { policeStation: user.policeStation, badgeNumber: user.badgeNumber }),
        ...(user.role === 'court' && { courtName: user.courtName, designation: user.designation })
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        ...(req.user.role === 'police' && { 
          policeStation: req.user.policeStation, 
          badgeNumber: req.user.badgeNumber 
        }),
        ...(req.user.role === 'court' && { 
          courtName: req.user.courtName, 
          designation: req.user.designation 
        }),
        lastLogin: req.user.lastLogin,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
  body('policeStation').if(body('role').equals('police')).optional().notEmpty().withMessage('Police station cannot be empty'),
  body('badgeNumber').if(body('role').equals('police')).optional().notEmpty().withMessage('Badge number cannot be empty'),
  body('courtName').if(body('role').equals('court')).optional().notEmpty().withMessage('Court name cannot be empty'),
  body('designation').if(body('role').equals('court')).optional().notEmpty().withMessage('Designation cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, policeStation, badgeNumber, courtName, designation } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (user.role === 'police') {
      if (policeStation) user.policeStation = policeStation;
      if (badgeNumber) user.badgeNumber = badgeNumber;
    }
    if (user.role === 'court') {
      if (courtName) user.courtName = courtName;
      if (designation) user.designation = designation;
    }

    await user.save();

    res.json({
      msg: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        ...(user.role === 'police' && { 
          policeStation: user.policeStation, 
          badgeNumber: user.badgeNumber 
        }),
        ...(user.role === 'court' && { 
          courtName: user.courtName, 
          designation: user.designation 
        })
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ msg: 'Password changed successfully' });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
