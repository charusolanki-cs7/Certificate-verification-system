const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  studentId: {
    type: String,
    required: true,
    trim: true
  },
  internshipDomain: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  pdfPath: {
    type: String
  },
  isValid: {
    type: Boolean,
    default: true
  },
  verificationCount: {
    type: Number,
    default: 0
  },
  lastVerified: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster searches
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ studentId: 1 });

// Update verification count and timestamp
certificateSchema.methods.updateVerification = function() {
  this.verificationCount += 1;
  this.lastVerified = new Date();
  return this.save();
};

module.exports = mongoose.model('Certificate', certificateSchema);
