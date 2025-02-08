const Chat = require('../models/chat');
const Message = require('../models/message');
const User = require('../models/user')
const mongoose = require('mongoose');


exports.getChatList = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ 
                status: "error", 
                message: "Invalid user ID"
            });
        }

        let chats = await Chat.find({ participants: userId }).lean();

        const privateChatParticipants = [];
        chats.forEach(chat => {
            if (chat.chatType === 'private' && chat.participants.length === 2) {
                const peerId = chat.participants.find(id => id.toString() !== userId);
                if (peerId) privateChatParticipants.push(peerId);
            }
        });

        const users = await User.find({ _id: { $in: privateChatParticipants } }, { _id: 1, username: 1 });

        const userMap = users.reduce((map, user) => {
            map[user._id.toString()] = user.username;
            return map;
        }, {});

        chats = chats.map(chat => {
            if (chat.chatType === 'private' && chat.participants.length === 2) {
                const peerId = chat.participants.find(id => id.toString() !== userId);
                if (peerId && userMap[peerId.toString()]) {
                    chat.title = userMap[peerId.toString()]; 
                }
            } 
            if (chat.avatar === "default") {
                chat.avatar = "/src/default_avatar.png";
            }
            return chat;
        });
        console.log(chats)

        res.status(200).json({
            status: "success",
            chats
        });

    } catch (error) {
        console.error("Error retrieving chat list:", error);
        res.status(500).json({ 
            status: "error", 
            message: "Failed to retrieve chat list" 
        });
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
    try {
        let { title, participants, chatType, avatar } = req.body;

        if (!participants || !Array.isArray(participants) || participants.length === 0) {
            return res.status(400).json({ 
                status: "error", 
                message: "Participants are required"
            });
        }
        
        participants.push(req.user.id);
        const participantIds = participants
            .filter(id => mongoose.Types.ObjectId.isValid(id)) 
            .map(id => new mongoose.Types.ObjectId(id));

        var existingUsers = await User.find({ _id: { $in: participantIds } });

        if (existingUsers.length !== participantIds.length) {
            return res.status(400).json({ 
                status: "error", 
                message: "One or more participants do not exist"
            });
        }

        if (chatType === "private") {
            title = "default";
            avatar = "default";
        } else if (chatType !== "group") {
            return res.status(400).json({ 
                status: "error", 
                message: "Unsupported chatType"
            });
        }

        if (participantIds.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "No valid participants found"
            });
        }   

        const newChat = new Chat({ title, participants: participantIds, chatType, avatar });
        const savedChat = await newChat.save();

        return res.status(201).json({ 
            status: "success", 
            message: "Chat created",
            chat: savedChat
        });

    } catch (error) {
        console.error("Error creating chat:", error);
        return res.status(500).json({ 
            status: "error", 
            message: "Failed to create chat" 
        });
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
