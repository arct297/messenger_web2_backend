const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  login: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  staySignedIn: { type: Boolean, required: false, default : false},
  Avatar: { type: String, required: false, default : 'default' },
  timestamp: { type: Date, default: Date.now },
  }, {
    collection: 'users',
    timestamps: true
  }

);

const User = mongoose.model('User', UserSchema);

module.exports = User
