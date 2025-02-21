const mongoose = require('mongoose');

const Message = require('../models/message');
const Chat = require('../models/chat');


exports.createMessage = async (req, res) => {
    try {
        const { content, chatId } = req.body;
        const sender = req.user.id;

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
        const { chatId, page } = req.query;
        
        if (!page) {
            page = 1;
        }

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

        let filter = { chat: chatId };

        const messages = await Message.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * 15)
            .limit(15)
            .populate('sender', 'username');

        console.log("📤 Отправляем сообщения:", messages.length, "шт.");

        res.status(200).json({
            status: "success",
            messagesList: messages.reverse(),
        });

    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
};





exports.updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(messageId)) {
            return res.status(400).json({ error: 'Invalid message ID' });
        }

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        if (message.sender.toString() !== userId) {
            return res.status(403).json({ error: 'You can only edit your own messages' });
        }

        message.content = content;
        message.edited = true;
        await message.save();

        res.status(200).json({ status: 'success', updatedMessage: message });
    } catch (error) {
        console.error('Error editing message:', error);
        res.status(500).json({ error: 'Failed to edit message' });
    }
};


exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(messageId)) {
            return res.status(400).json({ error: 'Invalid message ID' });
        }

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        if (message.sender.toString() !== userId) {
            return res.status(403).json({ error: 'You can only delete your own messages' });
        }

        message.content = "This message has been deleted";
        message.deleted = true;
        await message.save();

        res.status(200).json({ status: 'success', message: 'Message deleted' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
};


