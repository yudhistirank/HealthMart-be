// Kontroler untuk manajemen pesanan
const Order = require('../models/Order');
const Product = require('../models/Product');
const { generateOrderPDFBuffer } = require('../utils/pdf.generator');

// Buat pesanan baru
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod } = req.body;

    // Validasi input dasar
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Item pesanan wajib diisi' });
    }

    const populatedItems = [];

    // Validasi dan proses setiap item
    for (const it of items) {
      if (!it.product || !it.quantity) {
        return res.status(400).json({ message: 'Setiap item harus memiliki product dan quantity' });
      }

      const product = await Product.findById(it.product);
      if (!product) {
        return res.status(400).json({ message: `Produk tidak ditemukan: ${it.product}` });
      }

      if (product.stock < it.quantity) {
        return res.status(400).json({ message: `Stok tidak cukup untuk produk ${product._id}` });
      }

      populatedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: it.quantity,
      });

      // Kurangi stok produk (opsional: bisa dipindah ke saat pengiriman)
      product.stock = product.stock - it.quantity;
      await product.save();
    }

    const order = new Order({
      customer: req.user._id,
      items: populatedItems,
      total: totalAmount,
      paymentMethod: paymentMethod || 'COD',
      status: 'Pending',
    });

    await order.save();
    return res.status(201).json({
      _id: order._id,
      user: order.customer,
      status: order.status
    });
  } catch (error) {
    console.error('Error membuat pesanan:', error);
    return res.status(500).json({ message: 'Kesalahan server' });
  }
};

// Simulasi pemrosesan pembayaran dengan berbagai metode
exports.payOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, paymentDetails } = req.body;

    // Validasi metode pembayaran
    const allowedPaymentMethods = [
      'debit_card', 'credit_card', 'paypal', 'bank_transfer', 
      'e_wallet', 'cash_on_delivery', 'other'
    ];

    if (!paymentMethod || !allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({ 
        message: 'Metode pembayaran tidak valid',
        allowedMethods: allowedPaymentMethods
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    // Hanya pemilik atau admin yang bisa membayar
    if (req.user.role !== 'admin' && order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    if (order.status === 'paid') {
      return res.status(400).json({ message: 'Pesanan sudah dibayar' });
    }

    // Simulasi pemrosesan berdasarkan metode pembayaran
    let paymentStatus = 'paid';
    let paymentMessage = 'Pembayaran berhasil';

    switch (paymentMethod) {
      case 'debit_card':
      case 'credit_card':
        paymentMessage = 'Pembayaran kartu berhasil diproses';
        break;
      case 'paypal':
        paymentMessage = 'Pembayaran PayPal berhasil';
        break;
      case 'bank_transfer':
        paymentMessage = 'Pembayaran transfer bank berhasil';
        break;
      case 'e_wallet':
        paymentMessage = 'Pembayaran e-wallet berhasil';
        break;
      case 'cash_on_delivery':
        paymentMessage = 'Pembayaran COD berhasil didaftarkan';
        break;
      case 'other':
        paymentMessage = 'Pembayaran berhasil diproses';
        break;
      default:
        paymentStatus = 'processing';
        paymentMessage = 'Pembayaran sedang diproses';
    }

    order.status = paymentStatus;
    order.paymentMethod = paymentMethod;
    if (paymentDetails) {
      order.paymentDetails = paymentDetails;
    }
    await order.save();

    return res.json({ 
      message: paymentMessage, 
      order: order,
      paymentMethod: paymentMethod
    });
  } catch (error) {
    console.error('Error pembayaran:', error);
    return res.status(500).json({ message: 'Kesalahan server' });
  }
};

// Ambil detail pesanan
exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('customer', 'username email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    // Hanya pemilik pesanan atau admin yang bisa melihat
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    return res.json(order);
  } catch (error) {
    console.error('Error mengambil detail pesanan:', error);
    return res.status(500).json({ message: 'Kesalahan server' });
  }
};

// Generate receipt/struk pembayaran
exports.generateReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('customer', 'username email')
      .populate('items.product', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    // Hanya pemilik pesanan atau admin yang bisa melihat
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    const receipt = {
      orderId: order._id,
      customer: {
        name: order.customer.username,
        email: order.customer.email
      },
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })),
      total: order.total,
      paymentMethod: order.paymentMethod,
      status: order.status,
      date: order.createdAt
    };

    res.json({
      message: 'Struk pembayaran',
      receipt: receipt
    });
  } catch (error) {
    console.error('Error generate struk:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
};

// Checkout dari keranjang
exports.checkout = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    
    // Ambil keranjang user
    const Cart = require('../models/Cart');
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Keranjang kosong' });
    }

    // Validasi stok dan buat items untuk order
    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Stok tidak cukup untuk produk ${item.product.name}` 
        });
      }
      
      orderItems.push({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      });
    }

    // Buat order baru
    const order = new Order({
      customer: req.user._id,
      items: orderItems,
      total: cart.total,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      status: 'pending'
    });

    await order.save();

    // Kosongkan keranjang
    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.json({
      message: 'Checkout berhasil',
      order: order
    });
  } catch (error) {
    console.error('Error checkout:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
};

// Daftar pesanan dengan pagination dan filter (hanya admin)
exports.listOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};

    // Filter berdasarkan status
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('customer', 'username email');

    return res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      orders
    });
  } catch (error) {
    console.error('Error mengambil daftar pesanan:', error);
    return res.status(500).json({ message: 'Kesalahan server' });
  }
};

// Perbarui status pesanan (admin only) - untuk shipping
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status wajib diisi' });
    }

    // Validasi status yang diizinkan untuk shipping
    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('customer', 'username email');

    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error memperbarui status pesanan:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
};

// Ambil pesanan saya
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name price');

    res.json(orders);
  } catch (error) {
    console.error('Error mengambil pesanan saya:', error);
    res.status(500).json({ message: 'Kesalahan server' });
  }
};

// Generate PDF untuk pesanan dan kirim sebagai lampiran
exports.generatePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('customer', 'username email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    // Hanya pemilik pesanan atau admin yang bisa mengunduh
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    const buffer = await generateOrderPDFBuffer(order);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=tanda-terima-${order._id}.pdf`);
    return res.send(buffer);
  } catch (error) {
    console.error('Error generate PDF:', error);
    return res.status(500).json({ message: 'Kesalahan server' });
  }
};
