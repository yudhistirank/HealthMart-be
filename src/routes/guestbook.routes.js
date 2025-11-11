// Rute untuk manajemen guestbook
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');
const Guestbook = require('../models/Guestbook');

// Tambah entri guestbook (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Nama, email, dan pesan wajib diisi' });
    }

    const guestbook = new Guestbook({
      name,
      email,
      message
    });

    await guestbook.save();
    res.status(201).json(guestbook);
  } catch (error) {
    console.error('Error tambah guestbook:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
});

// Ambil semua entri guestbook (admin only)
router.get('/', authenticate, authorizeRole(['admin']), async (req, res) => {
  try {
    const guestbooks = await Guestbook.find().sort({ createdAt: -1 });
    res.json(guestbooks);
  } catch (error) {
    console.error('Error mengambil guestbook:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
});

// Hapus entri guestbook (admin only)
router.delete('/:id', authenticate, authorizeRole(['admin']), async (req, res) => {
  try {
    const guestbook = await Guestbook.findByIdAndDelete(req.params.id);

    if (!guestbook) {
      return res.status(404).json({ message: 'Entri guestbook tidak ditemukan' });
    }

    res.json({ message: 'Entri guestbook berhasil dihapus' });
  } catch (error) {
    console.error('Error hapus guestbook:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
});

module.exports = router;