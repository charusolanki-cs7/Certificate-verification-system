const Certificate = require('../models/Certificate.model');
const Student = require('../models/Student.model');
const path = require('path');
const fs = require('fs');

// @desc    Search certificate by ID
// @route   GET /api/certificate/search/:certificateId
// @access  Public
exports.searchCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId || certificateId.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a certificate ID'
      });
    }

    const certificate = await Certificate.findOne({ 
      certificateId: certificateId.toUpperCase().trim() 
    }).populate('student', 'email phone');

    if (!certificate) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate not found. Please check the certificate ID and try again.'
      });
    }

    if (!certificate.isValid) {
      return res.status(400).json({
        status: 'error',
        message: 'This certificate has been revoked or is no longer valid.'
      });
    }

    // Update verification count
    await certificate.updateVerification();

    res.status(200).json({
      status: 'success',
      data: {
        certificate: {
          certificateId: certificate.certificateId,
          studentName: certificate.studentName,
          studentId: certificate.studentId,
          internshipDomain: certificate.internshipDomain,
          startDate: certificate.startDate,
          endDate: certificate.endDate,
          issueDate: certificate.issueDate,
          isValid: certificate.isValid
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error searching for certificate',
      error: error.message
    });
  }
};

// @desc    Download certificate PDF
// @route   GET /api/certificate/download/:certificateId
// @access  Public
exports.downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ 
      certificateId: certificateId.toUpperCase().trim() 
    });

    if (!certificate) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate not found'
      });
    }

    if (!certificate.isValid) {
      return res.status(400).json({
        status: 'error',
        message: 'This certificate is no longer valid'
      });
    }

    if (!certificate.pdfPath) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate PDF not found'
      });
    }

    const filepath = path.join(__dirname, '..', certificate.pdfPath);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate file not found on server'
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${certificate.certificateId}.pdf"`);
    
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error downloading certificate',
      error: error.message
    });
  }
};

// @desc    Verify certificate (detailed info for students)
// @route   POST /api/certificate/verify
// @access  Public
exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateId, studentId } = req.body;

    if (!certificateId || !studentId) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both certificate ID and student ID'
      });
    }

    const certificate = await Certificate.findOne({ 
      certificateId: certificateId.toUpperCase().trim(),
      studentId: studentId.toUpperCase().trim()
    });

    if (!certificate) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate not found or does not match the provided student ID'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Certificate verified successfully',
      data: {
        certificate: {
          certificateId: certificate.certificateId,
          studentName: certificate.studentName,
          studentId: certificate.studentId,
          internshipDomain: certificate.internshipDomain,
          startDate: certificate.startDate,
          endDate: certificate.endDate,
          issueDate: certificate.issueDate,
          isValid: certificate.isValid
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error verifying certificate',
      error: error.message
    });
  }
};

// @desc    Get all certificates (Admin)
// @route   GET /api/certificate/all
// @access  Private (Admin only)
exports.getAllCertificates = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = search
      ? {
          $or: [
            { certificateId: { $regex: search, $options: 'i' } },
            { studentName: { $regex: search, $options: 'i' } },
            { studentId: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const certificates = await Certificate.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Certificate.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        certificates,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching certificates',
      error: error.message
    });
  }
};
