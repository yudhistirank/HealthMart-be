// Rute untuk manajemen user
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const User = require('../models/User');

// Ambil profil user
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error mengambil profil:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
});

// Perbarui profil user
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { username, email } = req.body;

    // Cek apakah username atau email sudah digunakan user lain
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: req.user._id }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username atau email sudah digunakan' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json({ message: 'Profil berhasil diperbarui' });
  } catch (error) {
    console.error('Error memperbarui profil:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
});

module.exports = router;