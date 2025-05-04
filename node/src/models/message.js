const mongoose = require("../configuration/dbConfig");

const messageSchema = new mongoose.Schema({
    chatId: String,
    senderId: String,
    text: String,
}, {
    timestamps: true,
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;