const userPlaylistService = require("../services/userPlaylistService");

class UserPlaylistController {
    async createUserPlaylist(req,res) {
        try{
            const {userId, name, description, created_date} = req.body;
            if (!userId) return res.status(400).json({ message: "User ID is required" });

            const saveUserPlaylist = await userPlaylistService.createUserPlaylist(userId, name, description, created_date);
            res.json(saveUserPlaylist);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async getUserPlaylistsByUserId(req, res) {
        try {
            const userId = req.params.id;
            const playlists = await userPlaylistService.getUserPlaylistsByUserId(userId);
            if (!playlists)
                return res.status(404).json({error: "User Playlists not found"});
            if (!playlists.length)  
                return res.status(200).json([]);  // empty array instead of error        
            res.status(200).json(playlists);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async getUserPlaylistById(req, res) {
        // get the playlist info
        const playlistId = req.params.id; //get the id
        try {
            const playlist = await userPlaylistService.getUserPlaylistById(playlistId);
            if (!playlist)
                return res.status(404).json({error: "Playlist not found"});
            res.json(playlist);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async updatePlaylist(req, res) {
        const playlistId = req.params.id; //get the id
        const updatedData = req.body;

        try {
            const updatedPlaylist = await userPlaylistService.updatePlaylist(playlistId, updatedData);
            if (!updatedPlaylist)
                return res.status(404).json({error: "Playlist not found"});
            res.json(updatedPlaylist);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async deletePlaylist(req, res) {
        const playlistId = req.params.id; //get the id
        try {
            const deletedPlaylist = await userPlaylistService.deletePlaylist(playlistId);
            if (!deletedPlaylist)
                return res.status(404).json({error: "Playlist not found"});
            res.json({message: "User deleted successfully ", playlist: deletedPlaylist});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
};

module.exports = new UserPlaylistController();