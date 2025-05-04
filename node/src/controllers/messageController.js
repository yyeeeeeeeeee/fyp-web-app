const MessageService = require("../services/messageService");

class MessageController {

    // create message
    async createMessage(req, res) {
        const { chatId, senderId, text } = req.body;
        try {
            const message = await MessageService.createMessage(chatId, senderId, text);
            if (!message)
                return res.status(404).json({error: "Message created fails."});

            res.status(200).json(message);
        } catch (error) {
            res.status(500).json("Failed to create message: ", error);
        }
    }


    // get messages
    async getMessages(req, res) {
        const {chatId} = req.params;
        try {
            const messages = await MessageService.getMessages(chatId);

            if (!messages)
                return res.status(404).json({error: "Messages were failed to retrieved."});

            res.status(200).json(messages);

        } catch (error) {
            res.status(500).json("Failed to find messages: ", error);
        }
    }

}

module.exports = new MessageController();