const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  	title: { type: String, required: false},
 	participants: [{ 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User', 
		required: true 
  	}],
	messages: [{ 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Message'
	}],
	avatar: { type: String, required: false, default : 'default' },
	chatType : {type: String, enum: ['group', 'private'], default: 'private'},
	}, {
	collection: 'chats',
	timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema);
