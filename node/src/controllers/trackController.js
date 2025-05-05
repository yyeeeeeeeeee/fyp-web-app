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

    async saveTracksControl(req, res) {
        try {
            const {playlistId, trackIds} = req.body;

            const trackPlaylistLinks = trackIds.map(trackId => ({
                playlistId,
                trackId
            }));

            const newTrackControl = await trackControlService.addTracksToPlaylist(trackPlaylistLinks);
            res.status(200).json({message: "Tracks saved successfully", newTrackControl});
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

    // Save Tracks
    async saveTracks(req, res) {
        try{
            const {tracksList} = req.body;

            const saveTrackData = await trackService.saveTracks(tracksList);
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