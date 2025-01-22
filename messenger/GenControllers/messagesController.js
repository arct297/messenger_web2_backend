const Message = require('../models/message');



exports.createMessage = async (req, res) => {
  try {
    const { sender, recipient, content } = req.body;
    if (!sender || !recipient || !content) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const message = await Message.create({ sender, recipient, content });
    res.status(201).json({ message: 'Message created successfully', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


//get all messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


//get specific message
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



exports.updateMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({ message: 'Message updated successfully', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
