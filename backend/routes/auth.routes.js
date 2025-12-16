const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getMe,
  updatePassword
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

const passwordUpdateValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Routes
router.post('/admin/register', authLimiter, registerValidation, validate, registerAdmin);
router.post('/admin/login', authLimiter, loginValidation, validate, loginAdmin);
router.get('/admin/me', protect, getMe);
router.put('/admin/updatepassword', protect, passwordUpdateValidation, validate, updatePassword);

module.exports = router;
