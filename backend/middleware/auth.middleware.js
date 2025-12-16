const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.model');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized. Please login to access this resource.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if admin exists and is active
      const admin = await Admin.findById(decoded.id).select('-password');
      
      if (!admin) {
        return res.status(401).json({
          status: 'error',
          message: 'Admin not found or has been deleted.'
        });
      }

      if (!admin.isActive) {
        return res.status(401).json({
          status: 'error',
          message: 'Your account has been deactivated. Please contact support.'
        });
      }

      // Attach admin to request
      req.admin = admin;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token has expired. Please login again.'
        });
      }
      
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please login again.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
      error: error.message
    });
  }
};

// Authorize roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action.'
      });
    }
    next();
  };
};
