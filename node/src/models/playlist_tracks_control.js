
// connect the playlist with tracks 

const mongoose = require("../configuration/dbConfig");

const playlistControlSchema = new mongoose.Schema({
    playlistId: { type: mongoose.Schema.Types.ObjectId, ref: "UserPlaylist", required: true },
    trackId: { type: mongoose.Schema.Types.ObjectId, ref: "tracks", required: true }
});

const playlistControl = mongoose.model("playlist_tracks_control", playlistControlSchema);

module.exports = playlistControl;