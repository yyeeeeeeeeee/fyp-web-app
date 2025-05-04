const Track = require("../models/tracks");

class TrackService {

    // retrieve track
    async getTrackById(trackId) {
        return await Track.findById(trackId);
    }

    // save new track
    async saveTrack(trackId, name, artistId, albumId) {
        const newTrack = new Track({trackId, name, artistId, albumId});
        return await newTrack.save();
    }

};

module.exports = new TrackService();