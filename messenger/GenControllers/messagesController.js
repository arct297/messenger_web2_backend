const Chat = require('../models/chat');
const Message = require('../models/message');

exports.createMessage = async (req, res) => {
  const { sender, recipient, content, chatId } = req.body;

  if (!sender || !recipient || !content || !chatId) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newMessage = new Message({ sender, recipient, content, chatId });
    const savedMessage = await newMessage.save();

    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: savedMessage._id },
    });

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create message' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('sender recipient chatId');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};
