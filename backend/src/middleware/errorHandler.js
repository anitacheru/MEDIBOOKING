const errorHandler = (err, _req, res, _next) => {
  console.error('[Error]', err);

  const code    = err.statusCode || err.status || 500;
  const message = err.message || 'Something went wrong.';

  res.status(code).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
