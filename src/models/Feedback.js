const mongoose = require('mongoose');

const fbSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
message: String,
createdAt: { type: Date, default: Date.now },
visible: { type: Boolean, default: true }
});

module.exports = mongoose.model('Feedback', fbSchema);