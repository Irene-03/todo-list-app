// ======================================================================
// Authentication Routes
// Phase 3: User registration, login, profile
// ======================================================================

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authenticateToken');
const { authLimiter } = require('../middleware/rateLimiter');
const asyncHandler = require('../middleware/asyncHandler');

// Validation rules
const registerValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation error handler
function handleValidationErrors(req, res, next) {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        status: 400,
        details: errors.array().map(err => ({
          field: err.path,
          msg: err.msg
        }))
      },
      timestamp: new Date().toISOString()
    });
  }
  next();
}

// Routes
router.post('/register', 
  authLimiter,
  registerValidation, 
  handleValidationErrors, 
  asyncHandler(register)
);

router.post('/login', 
  authLimiter,
  loginValidation, 
  handleValidationErrors, 
  asyncHandler(login)
);

router.get('/me', 
  authenticateToken, 
  asyncHandler(getMe)
);

module.exports = router;
