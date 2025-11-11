// Konfigurasi aplikasi utama
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

// Middleware
app.use(helmet());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// CORS: izinkan hanya FRONTEND_URL di produksi
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

// Pembatas laju (dasar)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 200,
});
app.use(limiter);

// Kesehatan
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Rute API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Tambah rute users, categories, cart, dan feedback
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const cartRoutes = require('./routes/cart.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const guestbookRoutes = require('./routes/guestbook.routes');

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/guestbook', guestbookRoutes);

// Default 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Penanganan error
app.use(errorHandler);

module.exports = app;
