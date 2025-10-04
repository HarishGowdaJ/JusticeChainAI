const mongoose = require('mongoose');

const firSchema = new mongoose.Schema({
  firNumber: {
    type: String,
    required: true,
    unique: true
  },
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true
  },
  policeStation: {
    type: String,
    required: true
  },
  investigatingOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  officerName: {
    type: String,
    required: true
  },
  firDetails: {
    type: String,
    required: true
  },
  sections: [{
    type: String,
    required: true
  }],
  accusedDetails: [{
    name: String,
    age: Number,
    address: String,
    phone: String,
    relation: String
  }],
  witnessDetails: [{
    name: String,
    age: Number,
    address: String,
    phone: String,
    statement: String
  }],
  status: {
    type: String,
    enum: ['filed', 'under_investigation', 'chargesheet_filed', 'case_filed', 'closed'],
    default: 'filed'
  },
  investigationNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  filedDate: {
    type: Date,
    default: Date.now
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

firSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FIR', firSchema);
