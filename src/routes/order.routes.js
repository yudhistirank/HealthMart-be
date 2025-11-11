const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');
const { body, validationResult } = require('express-validator');

// Buat pesanan (pelanggan)
router.post('/', authenticate, orderCtrl.createOrder);

// Ambil pesanan saya
router.get('/my-orders', authenticate, orderCtrl.getMyOrders);

// Ambil pesanan (pemilik atau admin)
router.get('/:id', authenticate, orderCtrl.getOrder);

// Unduh tanda terima PDF
router.get('/:id/pdf', authenticate, orderCtrl.generatePDF);

// Bayar pesanan (dengan berbagai metode)
router.post('/:id/pay', authenticate, orderCtrl.payOrder);

// Generate struk pembayaran
router.get('/:id/receipt', authenticate, orderCtrl.generateReceipt);

// Checkout dari keranjang
router.post('/checkout', authenticate, orderCtrl.checkout);

// Admin: daftar pesanan
router.get('/', authenticate, authorizeRole(['admin']), orderCtrl.listOrders);

// Admin: perbarui status
router.put('/:id', authenticate, authorizeRole(['admin']), orderCtrl.updateOrderStatus);

module.exports = router;
