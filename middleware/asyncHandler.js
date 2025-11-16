// ======================================================================
// Async Handler Wrapper
// Catches async errors without needing try/catch in every route
// ======================================================================

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
