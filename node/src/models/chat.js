const mongoose = require("../configuration/dbConfig");

const chatSchema = new mongoose.Schema({
    members: Array, 
},{ timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;