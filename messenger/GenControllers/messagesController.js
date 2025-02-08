const mongoose = require('mongoose');

const Message = require('../models/message');
const Chat = require('../models/chat');


exports.createMessage = async (req, res) => {
    try {
        const { content, chatId } = req.body;
        const sender = req.user.id;

        console.log(content);
        console.log(chatId);

        if (!content || !chatId) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.status(400).json({ error: 'Invalid chat ID' });
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        console.log(req.user)
        if (!chat.participants.some(id => id.toString() === req.user.id)) {
            return res.status(403).json({ error: 'You are not a participant of this chat' });
        }

        const newMessage = new Message({ sender, content, chat: chatId });
        const savedMessage = await newMessage.save();

        res.status(201).json({
            status : "success", 
            savedMessage
        });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Failed to create message' });
    }
};


exports.getMessages = async (req, res) => {
    try {
        const { chatId } = req.query;

        if (!chatId) {
            return res.status(400).json({ error: 'chatId is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return res.status(400).json({ error: 'Invalid chat ID' });
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        if (!chat.participants.some(id => id.toString() === req.user.id)) {
            return res.status(403).json({ error: 'You are not a participant of this chat' });
        }

        const messages = await Message.find({ chat: chatId })
            .populate('sender', 'name') 
            .sort({ timestamp: 1 });

        res.status(200).json({
            status : "success", 
            messagesList : messages,
        }
        );
        console.log(messages)
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
};
