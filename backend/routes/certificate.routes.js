const express = require('express');
const router = express.Router();
const {
  searchCertificate,
  downloadCertificate,
  verifyCertificate,
  getAllCertificates
} = require('../controllers/certificate.controller');
const { protect } = require('../middleware/auth.middleware');
const { searchLimiter } = require('../middleware/rateLimiter.middleware');

// Public routes (with rate limiting)
router.get('/search/:certificateId', searchLimiter, searchCertificate);
router.get('/download/:certificateId', downloadCertificate);
router.post('/verify', searchLimiter, verifyCertificate);

// Protected routes (Admin only)
router.get('/all', protect, getAllCertificates);

module.exports = router;
