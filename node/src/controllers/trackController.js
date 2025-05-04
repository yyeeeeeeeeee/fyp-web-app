const trackService = require("../services/tracksService");
const trackControlService = require("../services/tracksControlService");
const playlistService = require("../services/userPlaylistService");

class TrackController {

    // Track Playlist Control controller
    async getTracksControl(req,res) {
        const playlistId = req.params.playlistId;
        try {
            // get the tracks id
            const trackControl = await trackControlService.getTracksForPlaylist(playlistId);
            if (!trackControl)
                return res.status(404).json({error: "Internal Error: Cannot find track in this playlist from mongoDB database"});
            res.json(trackControl); // then use Spotify API to retrieve these tracks
        } catch(error) {
            res.status(500).json({error: error.message});
        }
    }

    async saveTrackControl(req, res) {
        try {
            const playlistId = req.params.playlistId;
            const {trackId} = req.body;
            const newTrackControl = await trackControlService.addTrackToPlaylist(playlistId,trackId);
            res.json(newTrackControl);
        } catch(error) {
            res.status(500).json({error: error.message});
        }
    }

    async deleteTrackControl(req, res) {
        try {
            const playlistId = req.params.playlistId;
            const {trackId} = req.body;
            const deletedTrackControl = await trackControlService.removeTrackFromPlaylist(playlistId, trackId);
            res.json({message: "Track deleted from playlist successfully ", track: deletedTrackControl});
        } catch(error) {
            res.status(500).json({error: error.message});
        }
    }

    async deletePlaylistControl(req, res) {
        try {
            // deleting tracks from the playlist
            const {playlistId} = req.body;
            const deletedPlaylistControl = await trackControlService.deletePlaylistControl(playlistId);
            if (!deletedPlaylistControl)
                return res.status(404).json({error: "Playlist Control not found"});
            res.json({message: "Track deleted from playlist successfully ", track:deletedPlaylistControl});
            
            // // detele the playlist
            // const deletedPlaylist = await playlistService.deletePlaylist(playlistId);
            // if (!deletedPlaylist)
            //     return res.status(404).json({error: "Playlist not found"});
            // res.json({message: "Playlist deleted successfully ", playlist: deletedPlaylist});
        } catch(error) {
            res.status(500).json({error: error.message});
        }
    }

    // Track table controller
    async saveTrack(req, res) {
        try{
            const {trackId, name, artistId, albumId} = req.body;
            const saveTrackData = await trackService.saveTrack(trackId, name, artistId, albumId);
            res.json(saveTrackData);
        } catch(error) {
            res.status(500).json({error: error.message});
        }
    }

    async getTrackById(req, res) {
        const trackId = req.params.id;
        try {
            const track = await trackService.getTrackById(trackId);
            if(!track)
                return res.status(404).json({error: "Not Found track from mongoDB database"});
            res.json(track); //query to spotify API get track audio
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
    
};

module.exports = new TrackController();