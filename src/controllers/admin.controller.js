// Kontroler untuk fungsi admin
const ShopRequest = require('../models/ShopRequest');

// Daftar permintaan toko
const listShopRequests = async (req, res) => {
  try {
    const requests = await ShopRequest.find().populate('vendorId', 'name email');
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
const approve = async (req, res) => {
  try {
    const request = await ShopRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: 'Permintaan tidak ditemukan' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menyetujui permintaan' });
  }
};

// Tolak permintaan toko
const reject = async (req, res) => {
  try {
    const request = await ShopRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: 'Permintaan tidak ditemukan' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menolak permintaan' });
  }
};

module.exports = {
  listShopRequests,
  createShopRequest,
  approve,
  reject
};