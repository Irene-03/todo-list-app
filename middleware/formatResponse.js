// ======================================================================
// Format Response Middleware
// Standardizes all API responses with consistent structure
// ======================================================================

function formatResponse(req, res, next) {
  // Store original json method
  const originalJson = res.json.bind(res);
  
  // Override json method
  res.json = function(data) {
    // If error response (status >= 400), don't format
    if (res.statusCode >= 400) {
      return originalJson(data);
    }
    
    // Format success response
    const formattedResponse = {
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    };
    
    return originalJson(formattedResponse);
  };
  
  next();
}

module.exports = formatResponse;
