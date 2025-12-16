const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  internshipDomain: {
    type: String,
    required: [true, 'Internship domain is required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateId: {
    type: String,
    sparse: true,
    unique: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Generate certificate ID before saving if certificate is issued
studentSchema.pre('save', function(next) {
  if (this.certificateIssued && !this.certificateId) {
    // Generate unique certificate ID: CERT-YEAR-RANDOMNUMBER
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    this.certificateId = `CERT-${year}-${random}`;
  }
  next();
});

// Index for faster searches
studentSchema.index({ studentId: 1 });
studentSchema.index({ certificateId: 1 });
studentSchema.index({ email: 1 });

module.exports = mongoose.model('Student', studentSchema);
