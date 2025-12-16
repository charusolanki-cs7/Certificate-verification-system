const XLSX = require('xlsx');
const Student = require('../models/Student.model');
const Certificate = require('../models/Certificate.model');
const EmailLog = require('../models/EmailLog.model');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { sendCertificateNotification } = require('../utils/email.util');

// @desc    Upload bulk students via Excel
// @route   POST /api/admin/upload-students
// @access  Private (Admin only)
exports.uploadStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload an Excel file'
      });
    }

    // Read Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (!data || data.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        status: 'error',
        message: 'Excel file is empty or invalid'
      });
    }

    const successfulUploads = [];
    const failedUploads = [];

    for (let i = 0; i < data.length; i++) {
      try {
        const row = data[i];
        
        // Validate required fields
        if (!row.studentId || !row.name || !row.email || !row.internshipDomain || !row.startDate || !row.endDate) {
          failedUploads.push({
            row: i + 2, // Excel row number (1-indexed + header)
            data: row,
            error: 'Missing required fields'
          });
          continue;
        }

        // Parse dates
        const startDate = new Date(row.startDate);
        const endDate = new Date(row.endDate);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          failedUploads.push({
            row: i + 2,
            data: row,
            error: 'Invalid date format'
          });
          continue;
        }

        if (endDate <= startDate) {
          failedUploads.push({
            row: i + 2,
            data: row,
            error: 'End date must be after start date'
          });
          continue;
        }

        // Check if student already exists
        const existingStudent = await Student.findOne({ studentId: row.studentId });
        if (existingStudent) {
          failedUploads.push({
            row: i + 2,
            data: row,
            error: 'Student ID already exists'
          });
          continue;
        }

        // Create student
        const student = await Student.create({
          studentId: row.studentId,
          name: row.name,
          email: row.email,
          phone: row.phone || '',
          internshipDomain: row.internshipDomain,
          startDate,
          endDate,
          uploadedBy: req.admin._id
        });

        successfulUploads.push(student);
      } catch (error) {
        failedUploads.push({
          row: i + 2,
          data: data[i],
          error: error.message
        });
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      status: 'success',
      message: `Uploaded ${successfulUploads.length} students successfully`,
      data: {
        successful: successfulUploads.length,
        failed: failedUploads.length,
        successfulUploads,
        failedUploads
      }
    });
  } catch (error) {
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Error uploading students',
      error: error.message
    });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin only)
exports.getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { studentId: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const students = await Student.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name email');

    const count = await Student.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        students,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// @desc    Generate certificate for student
// @route   POST /api/admin/generate-certificate/:studentId
// @access  Private (Admin only)
exports.generateCertificate = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findOne({ studentId });
    
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    if (student.certificateIssued) {
      return res.status(400).json({
        status: 'error',
        message: 'Certificate already issued for this student'
      });
    }

    // Generate certificate ID
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    const certificateId = `CERT-${year}-${random}`;

    // Update student
    student.certificateIssued = true;
    student.certificateId = certificateId;
    await student.save();

    // Create certificate record
    const certificate = await Certificate.create({
      certificateId,
      student: student._id,
      studentName: student.name,
      studentId: student.studentId,
      internshipDomain: student.internshipDomain,
      startDate: student.startDate,
      endDate: student.endDate
    });

    // Generate PDF (handled by separate function)
    const pdfPath = await generateCertificatePDF(certificate);
    certificate.pdfPath = pdfPath;
    await certificate.save();

    // Send email notification to student
    let emailStatus = null;
    try {
      const emailResult = await sendCertificateNotification({
        studentName: student.name,
        studentEmail: student.email,
        studentId: student.studentId,
        certificateId: certificate.certificateId,
        certificateObj: certificate._id,
        studentObj: student._id
      });
      emailStatus = emailResult.success ? 'sent' : 'failed';
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      emailStatus = 'failed';
    }

    res.status(201).json({
      status: 'success',
      message: 'Certificate generated successfully',
      data: {
        certificate,
        emailStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error generating certificate',
      error: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const certificatesIssued = await Certificate.countDocuments();
    const pendingCertificates = await Student.countDocuments({ certificateIssued: false });
    
    // Email statistics
    const totalEmailsSent = await EmailLog.countDocuments({ status: 'sent' });
    const failedEmails = await EmailLog.countDocuments({ status: 'failed' });
    
    const recentStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name studentId email internshipDomain createdAt');

    res.status(200).json({
      status: 'success',
      data: {
        totalStudents,
        certificatesIssued,
        pendingCertificates,
        totalEmailsSent,
        failedEmails,
        recentStudents
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// @desc    Get email logs
// @route   GET /api/admin/email-logs
// @access  Private (Admin only)
exports.getEmailLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = status ? { status } : {};

    const emailLogs = await EmailLog.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate('student', 'name studentId email')
      .populate('certificate', 'certificateId');

    const count = await EmailLog.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        emailLogs,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching email logs',
      error: error.message
    });
  }
};

// @desc    Retry failed email
// @route   POST /api/admin/retry-email/:emailLogId
// @access  Private (Admin only)
exports.retryEmail = async (req, res) => {
  try {
    const { retryFailedEmail } = require('../utils/email.util');
    const result = await retryFailedEmail(req.params.emailLogId);
    
    if (result.success) {
      res.status(200).json({
        status: 'success',
        message: 'Email sent successfully',
        data: result
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: result.message || 'Failed to send email',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error retrying email',
      error: error.message
    });
  }
};

// Helper function to generate PDF
async function generateCertificatePDF(certificate) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 50
      });

      const pdfDir = path.join(__dirname, '../certificates');
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
      }

      const filename = `${certificate.certificateId}.pdf`;
      const filepath = path.join(pdfDir, filename);
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Add certificate border
      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();
      doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80).stroke();

      // Title
      doc.fontSize(40)
         .font('Helvetica-Bold')
         .text('CERTIFICATE OF COMPLETION', 50, 120, {
           width: doc.page.width - 100,
           align: 'center'
         });

      // Subtitle
      doc.fontSize(16)
         .font('Helvetica')
         .text('This is to certify that', 50, 200, {
           width: doc.page.width - 100,
           align: 'center'
         });

      // Student name
      doc.fontSize(32)
         .font('Helvetica-Bold')
         .text(certificate.studentName.toUpperCase(), 50, 240, {
           width: doc.page.width - 100,
           align: 'center'
         });

      // Completion text
      doc.fontSize(16)
         .font('Helvetica')
         .text(`has successfully completed the internship in`, 50, 300, {
           width: doc.page.width - 100,
           align: 'center'
         });

      // Domain
      doc.fontSize(24)
         .font('Helvetica-Bold')
         .text(certificate.internshipDomain, 50, 340, {
           width: doc.page.width - 100,
           align: 'center'
         });

      // Dates
      const startDate = new Date(certificate.startDate).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });
      const endDate = new Date(certificate.endDate).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });

      doc.fontSize(14)
         .font('Helvetica')
         .text(`Duration: ${startDate} to ${endDate}`, 50, 390, {
           width: doc.page.width - 100,
           align: 'center'
         });

      // Certificate ID
      doc.fontSize(12)
         .font('Helvetica')
         .text(`Certificate ID: ${certificate.certificateId}`, 50, 440, {
           width: doc.page.width - 100,
           align: 'center'
         });

      // Issue date
      const issueDate = new Date(certificate.issueDate).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });
      doc.fontSize(11)
         .text(`Issue Date: ${issueDate}`, 50, 470, {
           width: doc.page.width - 100,
           align: 'center'
         });

      doc.end();

      stream.on('finish', () => {
        resolve(`/certificates/${filename}`);
      });

      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}
