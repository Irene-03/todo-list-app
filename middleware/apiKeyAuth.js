// ======================================================================
// API Key Authentication Middleware
// Enforces presence of X-API-KEY header for protected routes
// ======================================================================

function apiKeyAuth(req, res, next) {
  const requiredKey = process.env.API_KEY;

  // If API key is not configured, allow request but log warning once
  if (!requiredKey) {
    if (!process.env.__API_KEY_WARNED) {
      console.warn("⚠️  API_KEY is not defined in .env. API key validation skipped.");
      process.env.__API_KEY_WARNED = "true";
    }
    return next();
  }

  const providedKey = req.header("x-api-key") || req.header("X-API-KEY");

  if (!providedKey || providedKey !== requiredKey) {
    return res.status(401).json({
      success: false,
      error: {
        message: "Invalid or missing API key.",
        status: 401
      },
      timestamp: new Date().toISOString()
    });
  }

  return next();
}

module.exports = apiKeyAuth;
