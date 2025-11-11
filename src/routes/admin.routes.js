const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');
const { body, validationResult } = require('express-validator');

// Daftar permintaan toko (admin)
router.get('/shop-requests', authenticate, authorizeRole(['admin']), adminCtrl.listShopRequests);

// Buat permintaan toko (vendor) - endpoint publik untuk vendor meminta toko
router.post(
  '/shop-requests',
  authenticate,
  [
    body('vendorName').notEmpty().withMessage('vendorName required'),
  ],
  (req, res, next) => {
    // endpoint ini mungkin digunakan vendor (pelanggan). Kita panggil kontroler dari admin untuk kesederhanaan.
    return adminCtrl.createShopRequest ? adminCtrl.createShopRequest(req, res, next) : res.status(501).json({ message: 'Not implemented' });
  }
);

// Setujui & tolak (admin)
router.put('/shop-requests/:id/approve', authenticate, authorizeRole(['admin']), adminCtrl.approve);
router.put('/shop-requests/:id/reject', authenticate, authorizeRole(['admin']), adminCtrl.reject);

module.exports = router;
