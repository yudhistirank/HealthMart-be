const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');
const { body, validationResult } = require('express-validator');

// ==================== CUSTOMER MANAGEMENT ====================
// Lihat semua customer (admin only)
router.get('/customers', authenticate, authorizeRole(['admin']), adminCtrl.listCustomers);

// Hapus customer (admin only)
router.delete('/customers/:id', authenticate, authorizeRole(['admin']), adminCtrl.deleteCustomer);

// ==================== GUESTBOOK MANAGEMENT ====================
// Lihat semua guestbook entries (admin only)
router.get('/guestbook', authenticate, authorizeRole(['admin']), adminCtrl.listGuestbookEntries);

// Hapus guestbook entry (admin only)
router.delete('/guestbook/:id', authenticate, authorizeRole(['admin']), adminCtrl.deleteGuestbookEntry);

// ==================== CATEGORY MANAGEMENT ====================
// Lihat semua kategori (admin only)
router.get('/categories', authenticate, authorizeRole(['admin']), adminCtrl.listCategories);

// Tambah kategori baru (admin only)
router.post(
  '/categories',
  authenticate,
  authorizeRole(['admin']),
  [
    body('name').notEmpty().withMessage('Name is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    adminCtrl.createCategory(req, res, next);
  }
);

// Update kategori (admin only)
router.put('/categories/:id', authenticate, authorizeRole(['admin']), adminCtrl.updateCategory);

// Hapus kategori (admin only)
router.delete('/categories/:id', authenticate, authorizeRole(['admin']), adminCtrl.deleteCategory);

// ==================== PRODUCT MANAGEMENT ====================
// Lihat semua produk (admin only)
router.get('/products', authenticate, authorizeRole(['admin']), adminCtrl.listProducts);

// Tambah produk baru (admin only)
router.post(
  '/products',
  authenticate,
  authorizeRole(['admin']),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('stock').isNumeric().withMessage('Stock must be a number'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    adminCtrl.createProduct(req, res, next);
  }
);

// Update produk (admin only)
router.put('/products/:id', authenticate, authorizeRole(['admin']), adminCtrl.updateProduct);

// Hapus produk (admin only)
router.delete('/products/:id', authenticate, authorizeRole(['admin']), adminCtrl.deleteProduct);

// ==================== ORDER MANAGEMENT ====================
// Lihat semua order (admin only)
router.get('/orders', authenticate, authorizeRole(['admin']), adminCtrl.listOrders);

// Update status shipping (admin only)
router.put('/orders/:id/shipping', authenticate, authorizeRole(['admin']), adminCtrl.updateOrderShipping);

// ==================== SHOP REQUEST MANAGEMENT ====================
// Daftar permintaan toko (admin only)
router.get('/shop-requests', authenticate, authorizeRole(['admin']), adminCtrl.listShopRequests);

// Buat permintaan toko (vendor) - endpoint untuk vendor meminta toko
router.post(
  '/shop-requests',
  authenticate,
  [
    body('vendorName').notEmpty().withMessage('vendorName is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    adminCtrl.createShopRequest(req, res, next);
  }
);

// Setujui & tolak shop request (admin only)
router.put('/shop-requests/:id/approve', authenticate, authorizeRole(['admin']), adminCtrl.approveShopRequest);
router.put('/shop-requests/:id/reject', authenticate, authorizeRole(['admin']), adminCtrl.rejectShopRequest);

module.exports = router;
