
// storing the customed playlists by user themselves

const mongoose = require("../configuration/dbConfig");

const userPlaylistSchema = new mongoose.Schema({
    // userPlaylistId: String system will auto generated
    name: { type: String, required: true },
    description: { type: String },
    created_date: { type: String, default: new Date().toLocaleDateString('ms-MY') }, // Example: "28/02/2025"
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Reference to User table
});

const UserPlaylist = mongoose.model("UserPlaylist", userPlaylistSchema);

module.exports = UserPlaylist;