const mongoose = require('mongoose');

const srSchema = new mongoose.Schema({
    vendorName: String,
    ownerUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShopRequest', srSchema);