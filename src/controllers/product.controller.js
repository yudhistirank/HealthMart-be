// Kontroler untuk manajemen produk
const Product = require('../models/Product');

// Daftar produk dengan filter dan pagination
exports.listProducts = async (req, res) => {
  try {
    const { category, q, page = 1, limit = 12 } = req.query;
    const filter = {};

    // Filter berdasarkan kategori
    if (category) filter.category = category;

    // Filter berdasarkan pencarian nama
    if (q) filter.name = { $regex: q, $options: 'i' };

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('category');

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      products
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil daftar produk' });
  }
};

// Ambil detail produk berdasarkan ID
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil detail produk' });
  }
};

// Buat produk baru
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, stock, description, images } = req.body;

    // Validasi input dasar
    if (!name || !price || stock === undefined) {
      return res.status(400).json({ message: 'Nama, harga, dan stok wajib diisi' });
    }

    const product = new Product({
      name,
      price,
      category,
      stock,
      description
    });

    await product.save();
    res.status(201).json({
      _id: product._id,
      name: product.name,
      price: product.price
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat produk baru' });
  }
};

// Perbarui produk
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui produk' });
  }
};

// Hapus produk
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    res.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus produk' });
  }
};