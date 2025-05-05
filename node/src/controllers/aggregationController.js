const mongoose = require("mongoose");
const userPlaylist = require("../models/userPlaylist");

class AggregationController {

    async getPlaylistsWithTracks(req, res) {
        try {
            const userId = req.params.id;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: "Invalid user ID" });
            }    

            // Aggregate the playlists with tracks
            const response = await userPlaylist.aggregate([
                {
                    $match: { userId: new mongoose.Types.ObjectId(userId)} //Only get that user's playlists
                },
                {
                    $lookup: {
                        from: "playlist_tracks_controls", // your connect collection
                        localField: "_id",
                        foreignField: "playlistId",
                        as: "playlistTracks"
                    }
                },
                {
                    $unwind: "$playlistTracks"
                },
                {
                    $lookup: {
                        from: "tracks",
                        localField: "playlistTracks.trackId",
                        foreignField: "trackId", // match their trackId
                        as: "trackData"
                    }
                },
                {
                    $unwind: "$trackData"
                },
                {
                    $lookup: {
                        from: "artists",
                        localField: "trackData.artistId",
                        foreignField: "artistID", // match their artistID
                        as: "artistData"
                    }
                },
                { $unwind: "$artistData" },
                {
                    $addFields: {
                        "trackData.artists": "$artistData"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        description: { $first: "$description" },
                        created_date: { $first: "$created_date" },
                        tracks: { $push: "$trackData" },
                    }
                }
            ]);


            res.status(200).json({
                message: "Successfully to get all playlists data.",
                playlistsWithTracks: response
            });

        } catch (error) {
            console.error("Failed to get playlists with tracks: ", error);
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new AggregationController();