const User = require('../models/user');
const Chat = require('../models/chat');

exports.getChatList = (req, res) => {
    res.status(200).json({ chats: ['Chat 1', 'Chat 2', 'Chat n'] });
};

exports.getChatById = (req, res) => {
    const { id } = req.params;
    res.status(200).json({ chatId: id, messages: ['Hello', 'How are you?'] });
};

exports.sendMessage = (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ message: 'Message content is required' });
    }
    res.status(201).json({ chatId: id, sentMessage: message });
};


exports.createChat = async (req, res) => {
    const { chatType, withUserUsernames, chatAvatar, chatTitle } = req.body;

    for (const username in withUserUsernames) {
        if (Object.prototype.hasOwnProperty.call(withUserUsernames, username)) {
            const element = withUserUsernames[username];
            console.log(element);
        }
    }

    res.status(201).json({ message : "chat created" });
};