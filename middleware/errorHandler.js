// ======================================================================
// Error Handler Middleware - Enhanced with Standard Format
// ======================================================================

// 404 Not Found Handler
function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found",
      status: 404,
      path: req.originalUrl,
      method: req.method
    },
    timestamp: new Date().toISOString()
  });
}

// Central Error Handler
function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err);
  
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  // Handle specific error types
  let errorResponse = {
    success: false,
    error: {
      message: message,
      status: statusCode
    },
    timestamp: new Date().toISOString()
  };
  
  // Add stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.error.stack = err.stack;
  }
  
  // Handle CORS errors
  if (err.message === 'Not allowed by CORS') {
    errorResponse.error.message = 'Cross-Origin Request Blocked';
    errorResponse.error.hint = 'This origin is not allowed by CORS policy';
  }
  
  // Handle SQLite errors
  if (err.code === 'SQLITE_ERROR') {
    errorResponse.error.message = 'Database error occurred';
    if (process.env.NODE_ENV !== 'production') {
      errorResponse.error.details = err.message;
    }
  }
  
  res.status(statusCode).json(errorResponse);
}

module.exports = { notFound, errorHandler };
