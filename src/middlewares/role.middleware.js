// Middleware untuk otorisasi berdasarkan role
exports.authorizeRole = (allowedRoles = []) => (req, res, next) => {
  // Pastikan user sudah terautentikasi
  if (!req.user) {
    return res.status(401).json({ message: 'Belum terautentikasi' });
  }

  // Cek apakah role user ada dalam daftar role yang diizinkan
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  next();
};