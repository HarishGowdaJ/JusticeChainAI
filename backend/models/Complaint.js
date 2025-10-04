const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  citizenName: {
    type: String,
    required: true
  },
  citizenEmail: {
    type: String,
    required: true
  },
  citizenPhone: {
    type: String,
    required: true
  },
  complaintType: {
    type: String,
    required: true,
    enum: ['criminal', 'civil', 'other', 'theft', 'assault', 'fraud', 'harassment', 'property_damage']
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  incidentDate: {
    type: Date,
    required: true
  },
  evidence: [{
    filename: String,
    originalName: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'under_review', 'fir_filed', 'case_filed', 'resolved'],
    default: 'pending'
  },
  assignedPoliceStation: {
    type: String,
    default: null
  },
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  firNumber: {
    type: String,
    default: null
  },
  caseNumber: {
    type: String,
    default: null
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

complaintSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
