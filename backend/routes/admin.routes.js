const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  uploadStudents,
  getAllStudents,
  generateCertificate,
  getStats,
  getEmailLogs,
  retryEmail
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'students-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files (.xlsx, .xls) are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// All routes are protected (admin only)
router.use(protect);

// Routes
router.post('/upload-students', upload.single('file'), uploadStudents);
router.get('/students', getAllStudents);
router.post('/generate-certificate/:studentId', generateCertificate);
router.get('/stats', getStats);
router.get('/email-logs', getEmailLogs);
router.post('/retry-email/:emailLogId', retryEmail);

module.exports = router;
