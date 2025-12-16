const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true,
    trim: true
  },
  recipientName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  certificateId: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  certificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  status: {
    type: String,
    enum: ['sent', 'failed', 'pending'],
    default: 'pending'
  },
  sentAt: {
    type: Date
  },
  error: {
    type: String
  },
  emailProvider: {
    type: String,
    default: 'nodemailer'
  },
  attemptCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
emailLogSchema.index({ certificateId: 1 });
emailLogSchema.index({ recipient: 1 });
emailLogSchema.index({ status: 1 });

module.exports = mongoose.model('EmailLog', emailLogSchema);
