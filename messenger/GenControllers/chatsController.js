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
