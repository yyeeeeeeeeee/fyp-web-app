
// connect the playlist with tracks 

const mongoose = require("../configuration/dbConfig");

const playlistControlSchema = new mongoose.Schema({
    playlistId: { type: mongoose.Schema.Types.ObjectId, ref: "UserPlaylist", required: true },
    trackId: { type:String, required: true }
});

const playlistControl = mongoose.model("playlist_tracks_control", playlistControlSchema);

module.exports = playlistControl;