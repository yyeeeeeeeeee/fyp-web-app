const ChatService = require("../services/chatService");

class ChatController {

    // create chat
    async createChat(req, res) {
        const { firstId, secondId } = req.body;
        try {
            const chat = await ChatService.createChat(firstId, secondId);
            if (!chat)
                return res.status(404).json({error: "Chat created fails."});

            res.status(200).json(chat);
        } catch (error) {
            res.status(500).json("Failed to create chat: ", error);
        }
    }


    // get user chats
    async findUserChats(req, res) {
        const userId = req.params.userId;
        try {
            const chat = await ChatService.getUserChats(userId);

            if (!chat)
                return res.status(404).json({error: "Chats were failed to retrieved."});

            res.status(200).json(chat);
        } catch (error) {
            res.status(500).json("Failed to find chat: ", error);
        }
    }

    // find chat
    async findChat(req, res) {
        const { firstId, secondId } = req.params;
        try {
            const chat = await ChatService.findChat(firstId, secondId);

            if (!chat)
                return res.status(404).json({error: "Chat was failed to retrieved."});

            res.status(200).json(chat);
        } catch (error) {
            res.status(500).json("Failed to find chat: ", error);
        }
    }


}

module.exports = new ChatController();