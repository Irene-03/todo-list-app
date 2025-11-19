// ======================================================================
// JWT Authentication Middleware
// Phase 3: Token-based Authentication
// ======================================================================

const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Verify JWT Token
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Access denied. No token provided.',
          status: 401
        },
        timestamp: new Date().toISOString()
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid token. User not found.',
          status: 401
        },
        timestamp: new Date().toISOString()
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid token.',
          status: 401
        },
        timestamp: new Date().toISOString()
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token expired. Please login again.',
          status: 401
        },
        timestamp: new Date().toISOString()
      });
    }

    next(error);
  }
};

// Optional: Require admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Access denied. Admin privileges required.',
        status: 403
      },
      timestamp: new Date().toISOString()
    });
  }
  next();
};

module.exports = { authenticateToken, requireAdmin };
