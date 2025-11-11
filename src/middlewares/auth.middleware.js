// Middleware untuk autentikasi JWT
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware autentikasi - verifikasi token JWT
exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Cek apakah header authorization ada
  if (!authHeader) {
    return res.status(401).json({ message: 'Token tidak disediakan' });
  }

  // Ekstrak token dari header (format: "Bearer <token>")
  const token = authHeader.split(' ')[1];

  try {
    // Verifikasi token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Cari user berdasarkan ID dari token
    const user = await User.findById(payload.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ message: 'Pengguna tidak ditemukan' });
    }

    // Simpan data user ke request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa' });
  }
};