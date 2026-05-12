const rateLimit = require('express-rate-limit');

// Helper to build consistent 429 response
const rateLimitHandler = (req, res, next, options) => {
  res.status(429).json({
    status: 'error',
    statusCode: 429,
    message: options.message,
    retryAfter: Math.ceil(options.windowMs / 1000)
  });
};

// General rate limiter
exports.generalLimiter = rateLimit({
  windowMs: parseInt(process.env.GENERAL_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.GENERAL_RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later',
  handler: rateLimitHandler
});

// Auth rate limiter (login / register)
exports.authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again after 15 minutes',
  handler: rateLimitHandler
});

// Certificate search / verify limiter
exports.searchLimiter = rateLimit({
  windowMs: parseInt(process.env.SEARCH_RATE_LIMIT_WINDOW_MS) || 1 * 60 * 1000,
  max: parseInt(process.env.SEARCH_RATE_LIMIT_MAX) || 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many verification requests, please slow down and try again shortly',
  handler: rateLimitHandler
});