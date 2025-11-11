// Rute untuk manajemen kategori
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');
const Category = require('../models/Category');

// Ambil semua kategori
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error mengambil kategori:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
});

// Buat kategori baru (admin only)
router.post('/', authenticate, authorizeRole(['admin']), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Nama kategori wajib diisi' });
    }

    // Cek apakah kategori sudah ada
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Kategori sudah ada' });
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.error('Error membuat kategori:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
});

// Hapus kategori (admin only)
router.delete('/:id', authenticate, authorizeRole(['admin']), async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }

    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    console.error('Error menghapus kategori:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
});

module.exports = router;