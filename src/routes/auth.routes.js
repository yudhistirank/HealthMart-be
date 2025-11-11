const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Registrasi
router.post('/register', authCtrl.register);

// Masuk
router.post('/login', authCtrl.login);

// Me
router.get('/me', authenticate, authCtrl.me);

// Logout
router.post('/logout', authenticate, authCtrl.logout);

// Update Profile
router.put('/profile', authenticate, authCtrl.updateProfile);

module.exports = router;
