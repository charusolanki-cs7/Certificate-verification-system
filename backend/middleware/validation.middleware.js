const { validationResult } = require('express-validator');

// Validate request
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));

    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: extractedErrors
    });
  }
  
  next();
};
