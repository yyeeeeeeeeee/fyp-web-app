
const Chat = require("../models/chat");

class ChatService {

    async createChat(firstId, secondId) {
        const chat = await Chat.findOne({
            members: { $all: [firstId, secondId] },
        });
        if (chat) return chat;

        const newChat = new Chat({
            members: [firstId, secondId]
        });
        const response = await newChat.save();
        return response;
    }

    async getUserChats(userId) {
        const chats = await Chat.find({
            members: { $in: [userId] }
        })
        return chats;
    }

    async findChat(firstId, secondId) {
        const chat = await Chat.findOne({
            members: { $all: [firstId, secondId] },
        });
        return chat;
    }
};

module.exports = new ChatService();