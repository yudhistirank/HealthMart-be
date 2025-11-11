const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: Date,
    gender: { type: String, enum: ['male','female'] },
    address: String,
    city: String,
    contactNumber: String,
    paypalId: String,
    role: { type: String, enum: ['visitor','customer','admin'], default: 'customer' },
    createdAt: { type: Date, default: Date.now }
});

userSchema.methods.setPassword = async function(password){
this.passwordHash = await bcrypt.hash(password, 12);
};

userSchema.methods.validatePassword = async function(password){
return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);