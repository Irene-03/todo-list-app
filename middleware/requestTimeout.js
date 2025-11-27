// ======================================================================
// Request Timeout Middleware
// Aborts requests that exceed configured duration
// ======================================================================

const DEFAULT_TIMEOUT_MS = parseInt(process.env.REQUEST_TIMEOUT_MS || "10000", 10);

function requestTimeout(req, res, next) {
  const timeoutMs = Number.isNaN(DEFAULT_TIMEOUT_MS) ? 10000 : DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => {
    if (res.headersSent) {
      return;
    }

    res.status(503).json({
      success: false,
      error: {
        message: "Request timeout. Please try again later.",
        status: 503
      },
      timestamp: new Date().toISOString()
    });
  }, timeoutMs);

  res.on("finish", () => clearTimeout(timeoutId));
  res.on("close", () => clearTimeout(timeoutId));

  next();
}

module.exports = requestTimeout;
