export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(error, _req, res, _next) {
  if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `An account with this ${duplicateField} already exists.`,
    });
  }

  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({ success: false, message: messages.join('. ') });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'The supplied ID is not valid.' });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Request body is too large.' });
  }

  console.error(error);
  return res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.',
    ...(process.env.NODE_ENV === 'development' ? { detail: error.message } : {}),
  });
}
