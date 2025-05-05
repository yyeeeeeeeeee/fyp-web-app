const userPlaylist = require("../models/userPlaylist");

class UserPlaylistService {

    // create playlist
    async createUserPlaylist(userId, name, description, created_date) {
        if (!userId) throw new Error("User ID is required to create a playlist");
        const newPlaylist = new userPlaylist({ userId, name, description, created_date });

        return await newPlaylist.save();
    }

    // find an user playlists
    async getUserPlaylistsByUserId(userId) {
        return await userPlaylist.find({ userId }); // Find playlists by user
        //return await userPlaylist.find({ userId: new mongoose.Types.ObjectId(userId) });
    }

    // find a playlist details
    async getUserPlaylistById(playlistId) {
        return await userPlaylist.find({ playlistId }); // Find playlist
    }

    // update the playlist info
    async updatePlaylist(playlistId, updatedData) {
        return await userPlaylist.findByIdAndUpdate(playlistId, updatedData, {
            new:true
        })
    }

    // delete the playlist
    async deletePlaylist(playlistId) {
        return await userPlaylist.findByIdAndDelete(playlistId);
    }
};

module.exports = new UserPlaylistService();