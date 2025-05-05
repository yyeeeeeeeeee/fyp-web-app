const Track = require("../models/tracks");

class TrackService {

    // retrieve track
    async getTrackById(trackId) {
        return await Track.findById(trackId);
    }

    // save new tracks
    async saveTracks(saveTracks) {
        const newTracks = [];

        for (const track of saveTracks) {
            const exists = await Track.findOne({ trackId: track.trackId });
            if (!exists) {
                newTracks.push(track);
            }
        }

        if (newTracks.length > 0) {
            return await Track.insertMany(newTracks);
        } else {
            return []; // or null if you prefer
        }
    }

};

module.exports = new TrackService();