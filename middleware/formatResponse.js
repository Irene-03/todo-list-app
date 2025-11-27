// ======================================================================
// Format Response Middleware
// Standardizes all API responses with consistent structure
// ======================================================================

function formatResponse(req, res, next) {
  const originalJson = res.json.bind(res);

  res.setResponseMeta = (meta = {}) => {
    res.locals.responseMeta = meta && Object.keys(meta).length ? meta : undefined;
  };

  res.skipStandardFormat = () => {
    res.locals.skipStandardFormat = true;
  };

  res.json = function format(data) {
    if (res.locals.skipStandardFormat || res.statusCode >= 400) {
      return originalJson(data);
    }

    const formattedResponse = {
      success: true,
      data: data ?? null,
      timestamp: new Date().toISOString()
    };

    if (res.locals.responseMeta) {
      formattedResponse.meta = res.locals.responseMeta;
    }

    return originalJson(formattedResponse);
  };

  next();
}

module.exports = formatResponse;
