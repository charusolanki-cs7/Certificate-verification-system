const rateLimit = require('express-rate-limit');

// General rate limiter
exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Auth rate limiter (stricter for login/register)
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again after 15 minutes'
  },
  skipSuccessfulRequests: true
});

// Certificate search limiter
exports.searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 searches per minute
  message: {
    status: 'error',
    message: 'Too many search requests, please try again in a minute'
  }
});
