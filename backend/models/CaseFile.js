const mongoose = require('mongoose');

const caseFileSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    required: true,
    unique: true
  },
  firId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FIR',
    required: true
  },
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true
  },
  courtName: {
    type: String,
    required: true
  },
  judgeName: {
    type: String,
    required: true
  },
  publicProsecutor: {
    type: String,
    required: true
  },
  caseType: {
    type: String,
    required: true,
    enum: ['criminal', 'civil', 'family', 'commercial', 'constitutional']
  },
  caseDetails: {
    type: String,
    required: true
  },
  charges: [{
    section: String,
    description: String,
    punishment: String
  }],
  accusedDetails: [{
    name: String,
    age: Number,
    address: String,
    phone: String,
    status: {
      type: String,
      enum: ['absconding', 'on_bail', 'in_custody', 'acquitted', 'convicted'],
      default: 'on_bail'
    }
  }],
  caseStatus: {
    type: String,
    enum: ['filed', 'hearing', 'judgment', 'appealed', 'closed'],
    default: 'filed'
  },
  hearingDates: [{
    date: Date,
    purpose: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'adjourned', 'cancelled'],
      default: 'scheduled'
    },
    notes: String
  }],
  documents: [{
    type: String,
    filename: String,
    originalName: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  judgment: {
    verdict: {
      type: String,
      enum: ['guilty', 'not_guilty', 'acquitted', 'convicted']
    },
    sentence: String,
    fine: Number,
    judgmentDate: Date,
    judgmentText: String
  },
  nextHearingDate: {
    type: Date,
    default: null
  },
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

caseFileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CaseFile', caseFileSchema);
