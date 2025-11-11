// Kontroler untuk autentikasi pengguna
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Registrasi pengguna baru
exports.register = async (req, res) => {
  try {
    const { username, password, retypePassword, email, dob, gender, address, city, contactNumber, paypalId } = req.body;

    // Validasi input wajib
    if (!username || !password || !retypePassword || !email) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Validasi password match
    if (password !== retypePassword) {
      return res.status(400).json({ message: 'Password dan konfirmasi password tidak cocok' });
    }

    // Validasi panjang password
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }

    // Validasi gender
    if (gender && !['male', 'female'].includes(gender)) {
      return res.status(400).json({ message: 'Gender harus male atau female' });
    }

    // Cek apakah username atau email sudah digunakan
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username atau email sudah digunakan' });
    }

    // Buat user baru dengan role default 'customer'
    const user = new User({
      username,
      email,
      dob,
      gender,
      address,
      city,
      contactNumber,
      paypalId,
      role: 'customer' // Default role untuk registrasi
    });

    await user.setPassword(password);
    await user.save();

    // Generate JWT token untuk response
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: token
    });
  } catch (error) {
    console.error('Error registrasi:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
};

// Login pengguna (supports both username and email)
exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Validasi input
    if (!userId || !password) {
      return res.status(400).json({ message: 'User ID/Username dan password wajib diisi' });
    }

    // Cari user berdasarkan email atau username
    const user = await User.findOne({
      $or: [
        { email: userId },
        { username: userId }
      ]
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Kredensial tidak valid' });
    }

    // Validasi password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Kredensial tidak valid' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error login:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
};

// Ambil data pengguna saat ini
exports.me = async (req, res) => {
  res.json(req.user);
};

// Logout pengguna
exports.logout = async (req, res) => {
  res.json({ message: 'Logout berhasil' });
};

// Update profil pengguna
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, dob, gender, address, city, contactNumber, paypalId } = req.body;
    
    // Validasi gender jika ada
    if (gender && !['male', 'female'].includes(gender)) {
      return res.status(400).json({ message: 'Gender harus male atau female' });
    }

    // Cek apakah username atau email sudah digunakan (oleh user lain)
    if (username || email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: req.user._id } },
          { $or: [
            ...(username ? [{ username }] : []),
            ...(email ? [{ email }] : [])
          ]}
        ]
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Username atau email sudah digunakan' });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(username && { username }),
        ...(email && { email }),
        ...(dob && { dob }),
        ...(gender && { gender }),
        ...(address && { address }),
        ...(city && { city }),
        ...(contactNumber && { contactNumber }),
        ...(paypalId && { paypalId })
      },
      { new: true, runValidators: true }
    );

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      dob: updatedUser.dob,
      gender: updatedUser.gender,
      address: updatedUser.address,
      city: updatedUser.city,
      contactNumber: updatedUser.contactNumber,
      paypalId: updatedUser.paypalId,
      role: updatedUser.role
    });
  } catch (error) {
    console.error('Error update profil:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
};