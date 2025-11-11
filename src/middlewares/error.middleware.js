// Middleware untuk penanganan error global
exports.errorHandler = (err, req, res, next) => {
  // Log error untuk debugging
  console.error('Error:', err);

  // Jangan expose error stack di production
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Response error
  res.status(err.status || 500).json({
    message: err.message || 'Kesalahan server internal',
    ...(isDevelopment && { stack: err.stack }) // Hanya tampilkan stack di development
  });
};