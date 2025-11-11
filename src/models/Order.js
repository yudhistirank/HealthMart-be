const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
items: [{
product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
    }],
    total: Number,
    status: { type: String, enum: ['pending','paid','shipped','cancelled'], default: 'pending' },
    paymentMethod: String,
    createdAt: { type: Date, default: Date.now },
    shippingInfo: {
    address: String,
    city: String,
    contactNumber: String
    }
});

module.exports = mongoose.model('Order', orderSchema);