
const Message = require("../models/message");

class MessageService {

    async createMessage(chatId, senderId, text) {
        const message = new Message({ chatId, senderId, text });
        return await message.save();
    }

    async getMessages(chatId) {
        return await Message.find({chatId});
    }
};

module.exports = new MessageService();