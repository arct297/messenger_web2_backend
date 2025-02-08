const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  	title: { 
        type: String, 
        required: function() { return this.chatType === 'group'; } 
    },
 	participants: [{ 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User', 
		required: true 
  	}],
	avatar: { 
        type: String, 
        default: null 
    },
	chatType: {
        type: String, 
        enum: ['group', 'private'], 
        default: 'private',
        required: true
    },
}, {
	collection: 'chats',
	timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema);
