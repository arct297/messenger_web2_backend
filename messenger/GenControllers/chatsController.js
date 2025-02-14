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
                status: "warning", 
                message: "Participants are required"
            });
        }
        
        const creatorUser = await User.findById(req.user.id);
        if (!creatorUser) {
            return res.status(500).json({ 
                status: "error", 
                message: "Some error happened. Please, try to relogin!"
            });
        }
        
        participants.push(creatorUser.username);

        const existingUsers = await User.find({ username: { $in: participants } });
        if (existingUsers.length !== participants.length) {
            return res.status(400).json({ 
                status: "warning", 
                message: "One or more participants do not exist"
            });
        }

        let participantsIds = existingUsers.map(user => user._id);

        if (chatType === "private") {
            title = "default";
            avatar = "default";

            const existingChat = await Chat.findOne({ 
                chatType: "private",
                participants: { $all: participantsIds, $size: participantsIds.length }
            });

            if (existingChat) {
                return res.status(400).json({
                    status: "warning",
                    message: "Private chat with these participants already exists"
                });
            }
        } else if (chatType !== "group") {
            return res.status(400).json({ 
                status: "error", 
                message: "Unsupported chatType"
            });
        }

        if (participantsIds.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "No valid participants found"
            });
        }

        const newChat = new Chat({ title, participants: participantsIds, chatType, avatar });
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
