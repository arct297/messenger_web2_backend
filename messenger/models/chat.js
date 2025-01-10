const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  name: { type: String, required: false },
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }],
  messages: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Message'
  }],
  Avatar: { type: String, required: false, default : 'default' },
}, {
  collection: 'chats',
  timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema);
