const Admin = require('../models/Admin.model');
const { sendTokenResponse } = require('../utils/token.util');

// @desc    Register admin
// @route   POST /api/auth/admin/register
// @access  Public (but should be protected in production)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        status: 'error',
        message: 'Admin with this email already exists'
      });
    }

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password
    });

    sendTokenResponse(admin, 201, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating admin account',
      error: error.message
    });
  }
};

// @desc    Login admin
// @route   POST /api/auth/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Check for admin (include password for comparison)
    const admin = await Admin.findOne({ email }).select('+password');
    
    if (!admin) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated'
      });
    }

    // Verify password
    const isPasswordCorrect = await admin.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    sendTokenResponse(admin, 200, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: error.message
    });
  }
};

// @desc    Get current logged in admin
// @route   GET /api/auth/admin/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        admin
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching admin details',
      error: error.message
    });
  }
};

// @desc    Update admin password
// @route   PUT /api/auth/admin/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide current and new password'
      });
    }

    const admin = await Admin.findById(req.admin.id).select('+password');

    // Verify current password
    const isPasswordCorrect = await admin.comparePassword(currentPassword);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    sendTokenResponse(admin, 200, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating password',
      error: error.message
    });
  }
};
