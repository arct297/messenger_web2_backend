const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    staySignedIn: { type: Boolean, required: false, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String, required: false, default: 'default' },
    timestamp: { type: Date, default: Date.now },

    is_verified: { type: Boolean, default: false },               // Статус подтверждения почты
    verification_code: { type: String, required: false },         // Код для подтверждения почты

}, {
    collection: 'users',
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
