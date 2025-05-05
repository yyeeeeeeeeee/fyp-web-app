const mongoose = require("../configuration/dbConfig");
const TrackControl = require("../models/playlist_tracks_control");

class TrackControlService {

    // add tracks to a playlist
    async addTracksToPlaylist(trackPlaylistLinks) {
        const newTrackControl = [];

        for (const control of trackPlaylistLinks) {
            const exists = await TrackControl.findOne({ 
                playlistId: new mongoose.Types.ObjectId(control.playlistId), trackId: control.trackId 
            });
            if (!exists) {
                newTrackControl.push(control);
            }
        }

        if (newTrackControl.length > 0) {
            return await TrackControl.insertMany(newTrackControl);
        } else {
            return []; // or null if you prefer
        }
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