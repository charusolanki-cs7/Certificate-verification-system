const jwt = require('jsonwebtoken');

// Generate JWT Token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Send token response
exports.sendTokenResponse = (admin, statusCode, res) => {
  const token = this.generateToken(admin._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      admin
    }
  });
};
