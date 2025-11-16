// ======================================================================
// Simple Logger Middleware (Deprecated - Use Morgan Instead)
// Kept for backwards compatibility
// ======================================================================

module.exports = function logger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  next();
};
