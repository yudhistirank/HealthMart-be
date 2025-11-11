const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cart.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Ambil keranjang user
router.get('/', authenticate, cartCtrl.getCart);

// Tambah produk ke keranjang
router.post('/add', authenticate, cartCtrl.addToCart);

// Update quantity item di keranjang
router.put('/update', authenticate, cartCtrl.updateCartItem);

// Hapus item dari keranjang
router.delete('/remove/:productId', authenticate, cartCtrl.removeFromCart);

// Kosongkan keranjang
router.delete('/clear', authenticate, cartCtrl.clearCart);

module.exports = router;