const mongoose = require('mongoose');

// Koneksi ke database MongoDB
const connectDB = async () => {
  try {
    // Hapus opsi deprecated untuk versi driver terbaru
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Terhubung: ${conn.connection.host}`);
  } catch (error) {
    console.error('Kesalahan koneksi MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;