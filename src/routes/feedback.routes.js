// Rute untuk manajemen feedback
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');
const Feedback = require('../models/Feedback');

// Berikan feedback (customer)
router.post('/', authenticate, async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    if (!orderId || !rating) {
      return res.status(400).json({ message: 'Order ID dan rating wajib diisi' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating harus antara 1-5' });
    }

    // Cek apakah order milik user
    const Order = require('../models/Order');
    const order = await Order.findOne({ _id: orderId, customer: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    // Cek apakah sudah pernah memberikan feedback
    const existingFeedback = await Feedback.findOne({ order: orderId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback sudah diberikan untuk pesanan ini' });
    }

    const feedback = new Feedback({
      order: orderId,
      customer: req.user._id,
      rating,
      comment
    });

    await feedback.save();
    await feedback.populate('customer', 'username');

    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error memberikan feedback:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
});

// Ambil feedback user
router.get('/my-feedback', authenticate, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ customer: req.user._id })
      .populate('order', 'items total')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    console.error('Error mengambil feedback:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
});

// Ambil semua feedback (admin)
router.get('/', authenticate, authorizeRole(['admin']), async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('customer', 'username email')
      .populate('order', 'items total status')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    console.error('Error mengambil semua feedback:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
});

// Hapus feedback (admin)
router.delete('/:id', authenticate, authorizeRole(['admin']), async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback tidak ditemukan' });
    }

    res.json({ message: 'Feedback berhasil dihapus' });
  } catch (error) {
    console.error('Error hapus feedback:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
});

module.exports = router;