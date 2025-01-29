const Chat = require('../models/chat');
const Message = require('../models/message');

exports.getChatList = async (req, res) => {
  try {
    const chats = await Chat.find().populate('messages participants');
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chat list' });
  }
};

exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).populate('messages participants');
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chat' });
  }
};

exports.createChat = async (req, res) => {
  const { title, participants, chatType, avatar } = req.body;

  if (!title || !participants) {
    return res.status(400).json({ error: 'Title and participants are required' });
  }

  try {
    const newChat = new Chat({ title, participants, chatType, avatar });
    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat' });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const deletedChat = await Chat.findByIdAndDelete(req.params.id);
    if (!deletedChat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    res.status(200).json({ message: 'Chat deleted successfully', deletedChat });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};
