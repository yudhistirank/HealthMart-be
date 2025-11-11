// Kontroler untuk manajemen keranjang belanja
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Ambil keranjang user
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price images stock');

    if (!cart) {
      return res.json({
        user: req.user._id,
        items: [],
        total: 0
      });
    }

    res.json(cart);
  } catch (error) {
    console.error('Error mengambil keranjang:', error);
    res.status(500).json({ message: 'Gagal mengambil keranjang' });
  }
};

// Tambah item ke keranjang
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validasi input
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Product ID dan quantity wajib diisi (minimum 1)' });
    }

    // Cek produk ada
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    // Cek stok cukup
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Stok tidak mencukupi' });
    }

    // Cari atau buat keranjang
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
        total: 0
      });
    }

    // Cek apakah produk sudah ada di keranjang
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Jika sudah ada, tambah quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      // Cek stok lagi
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: 'Stok tidak mencukupi untuk total quantity' });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = product.price; // Update price
    } else {
      // Jika belum ada, tambah item baru
      cart.items.push({
        product: productId,
        quantity: quantity,
        price: product.price
      });
    }

    // Hitung total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    await cart.save();

    res.json({
      message: 'Produk berhasil ditambahkan ke keranjang',
      cart: cart
    });
  } catch (error) {
    console.error('Error menambah ke keranjang:', error);
    res.status(500).json({ message: 'Gagal menambah ke keranjang' });
  }
};

// Update quantity item di keranjang
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validasi input
    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'Product ID dan quantity wajib diisi' });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity tidak boleh negatif' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Keranjang tidak ditemukan' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Produk tidak ditemukan di keranjang' });
    }

    if (quantity === 0) {
      // Hapus item jika quantity 0
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Produk tidak ditemukan' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Stok tidak mencukupi' });
      }

      cart.items[itemIndex].quantity = quantity;
    }

    // Hitung total lagi
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    await cart.save();

    res.json({
      message: 'Keranjang berhasil diperbarui',
      cart: cart
    });
  } catch (error) {
    console.error('Error memperbarui keranjang:', error);
    res.status(500).json({ message: 'Gagal memperbarui keranjang' });
  }
};

// Hapus item dari keranjang
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Keranjang tidak ditemukan' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Produk tidak ditemukan di keranjang' });
    }

    // Hapus item
    cart.items.splice(itemIndex, 1);

    // Hitung total lagi
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    await cart.save();

    res.json({
      message: 'Produk berhasil dihapus dari keranjang',
      cart: cart
    });
  } catch (error) {
    console.error('Error menghapus dari keranjang:', error);
    res.status(500).json({ message: 'Gagal menghapus dari keranjang' });
  }
};

// Kosongkan keranjang
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Keranjang tidak ditemukan' });
    }

    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.json({
      message: 'Keranjang berhasil dikosongkan',
      cart: cart
    });
  } catch (error) {
    console.error('Error mengosongkan keranjang:', error);
    res.status(500).json({ message: 'Gagal mengosongkan keranjang' });
  }
};