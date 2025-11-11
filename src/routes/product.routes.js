const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');
const { body, validationResult } = require('express-validator');

// Daftar & cari
router.get('/', productCtrl.listProducts);

// Ambil produk tunggal
router.get('/:id', productCtrl.getProduct);

// Buat produk (admin)
router.post(
  '/',
  authenticate,
  authorizeRole(['admin']),
  [
    body('name').notEmpty(),
    body('price').isNumeric(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    return productCtrl.createProduct(req, res, next);
  }
);

// Perbarui produk (admin)
router.put('/:id', authenticate, authorizeRole(['admin']), productCtrl.updateProduct);

// Hapus produk (admin)
router.delete('/:id', authenticate, authorizeRole(['admin']), productCtrl.deleteProduct);

module.exports = router;
