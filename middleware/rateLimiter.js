// ======================================================================
// Rate Limiting Middleware
// Phase 3: Request Rate Limiting for Security
// ======================================================================

const rateLimit = require('express-rate-limit');

// General API rate limiter - 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again after 15 minutes.',
      status: 429
    },
    timestamp: new Date().toISOString()
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests from this IP, please try again after 15 minutes.',
        status: 429,
        retryAfter: '15 minutes'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Stricter rate limiter for authentication routes - 5 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts, please try again after 15 minutes.',
      status: 429
    },
    timestamp: new Date().toISOString()
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
        status: 429,
        retryAfter: '15 minutes'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Create Todo rate limiter - 20 requests per 15 minutes
const createTodoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: {
      message: 'Too many todos created, please try again later.',
      status: 429
    },
    timestamp: new Date().toISOString()
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  createTodoLimiter
};
