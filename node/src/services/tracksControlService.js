const mongoose = require("../configuration/dbConfig");
const TrackControl = require("../models/playlist_tracks_control");

class TrackControlService {

    // add track to a playlist
    async addTrackToPlaylist(playlistId, trackId) {
        const newTrackPlaylist = new TrackControl({playlistId, trackId});
        return await newTrackPlaylist.save();
    }

    // retrieve a playlist's tracks 
    async getTracksForPlaylist(playlistId) {
        return await TrackControl.find({ 
            playlistId: new mongoose.Types.ObjectId(playlistId)
        });
    }

    // remove a track from a playlist
    async removeTrackFromPlaylist(playlistId,trackId) {
        return await TrackControl.deleteOne({playlistId: playlistId,trackId: trackId});
    }

    // delete a playlist
    async deletePlaylistControl(playlistId) {
        return await TrackControl.deleteMany({ playlistId: playlistId });
    }

};

module.exports = new TrackControlService();