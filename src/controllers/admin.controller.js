// Kontroler untuk fungsi admin
const ShopRequest = require('../models/ShopRequest');
const User = require('../models/User');
const Guestbook = require('../models/Guestbook');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

// ==================== CUSTOMER MANAGEMENT ====================

// Lihat semua customer
const listCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-passwordHash');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil daftar customer' });
  }
};

// Hapus customer
const deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findOneAndDelete({
      _id: req.params.id,
      role: 'customer'
    });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer tidak ditemukan' });
    }
    
    res.json({ message: 'Customer berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus customer' });
  }
};

// ==================== GUESTBOOK MANAGEMENT ====================

// Lihat semua guestbook entries
const listGuestbookEntries = async (req, res) => {
  try {
    const entries = await Guestbook.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil guestbook entries' });
  }
};

// Hapus guestbook entry
const deleteGuestbookEntry = async (req, res) => {
  try {
    const entry = await Guestbook.findByIdAndDelete(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ message: 'Guestbook entry tidak ditemukan' });
    }
    
    res.json({ message: 'Guestbook entry berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus guestbook entry' });
  }
};

// ==================== CATEGORY MANAGEMENT ====================

// Lihat semua kategori
const listCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil daftar kategori' });
  }
};

// Tambah kategori baru
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Kategori dengan nama tersebut sudah ada' });
    }
    
    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat kategori baru' });
  }
};

// Update kategori
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate kategori' });
  }
};

// Hapus kategori
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }
    
    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus kategori' });
  }
};

// ==================== PRODUCT MANAGEMENT ====================

// Lihat semua produk (admin)
const listProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name description')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil daftar produk' });
  }
};

// Tambah produk baru
const createProduct = async (req, res) => {
  try {
    const { name, price, category, stock, description, images } = req.body;
    
    if (!name || !price || stock === undefined) {
      return res.status(400).json({ message: 'Nama, harga, dan stok wajib diisi' });
    }
    
    const product = new Product({
      name,
      price,
      category,
      stock,
      description,
      images: images || []
    });
    
    await product.save();
    const populatedProduct = await Product.findById(product._id).populate('category');
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat produk baru' });
  }
};

// Update produk
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category');
    
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate produk' });
  }
};

// Hapus produk
const deleteProduct = async (req, res) => {
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

// ==================== ORDER MANAGEMENT ====================

// Lihat semua order
const listOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'username email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil daftar order' });
  }
};

// Update status shipping
const updateOrderShipping = async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'paid', 'shipped', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer', 'username email')
     .populate('items.product', 'name price');
    
    if (!order) {
      return res.status(404).json({ message: 'Order tidak ditemukan' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate status order' });
  }
};

// ==================== SHOP REQUEST MANAGEMENT ====================

// Daftar permintaan toko
const listShopRequests = async (req, res) => {
  try {
    const requests = await ShopRequest.find().populate('vendorId', 'username email');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil permintaan toko' });
  }
};

// Buat permintaan toko baru
const createShopRequest = async (req, res) => {
  try {
    const { vendorName, description } = req.body;
    const newRequest = new ShopRequest({
      vendorId: req.user.id,
      vendorName,
      description,
      status: 'pending'
    });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat permintaan toko' });
  }
};

// Setujui permintaan toko
const approveShopRequest = async (req, res) => {
  try {
    const request = await ShopRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).populate('vendorId', 'username email');
    
    if (!request) return res.status(404).json({ message: 'Permintaan tidak ditemukan' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menyetujui permintaan' });
  }
};

// Tolak permintaan toko
const rejectShopRequest = async (req, res) => {
  try {
    const request = await ShopRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).populate('vendorId', 'username email');
    
    if (!request) return res.status(404).json({ message: 'Permintaan tidak ditemukan' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menolak permintaan' });
  }
};

module.exports = {
  // Customer management
  listCustomers,
  deleteCustomer,
  // Guestbook management
  listGuestbookEntries,
  deleteGuestbookEntry,
  // Category management
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  // Product management
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  // Order management
  listOrders,
  updateOrderShipping,
  // Shop request management
  listShopRequests,
  createShopRequest,
  approveShopRequest,
  rejectShopRequest
};