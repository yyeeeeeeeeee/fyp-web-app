const artistService = require("../services/artistService");
//const bcrypt = require('bcrypt');

class ArtistController {

    async saveArtists(req, res) {
        try {
            const artistList = req.body.artistList;
            const artists = await artistService.saveArtists(artistList);
            
            res.status(200).json({
                message: "Artists saved successfully",
                savedArtists: artists,
            });
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async getAllArtists(req, res) {
        try {
            const artists = await artistService.getAllArtists();
            res.json(artists);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async getArtistById(req, res) {
        const id = req.params.id; //get the id
        try {
            const artist = await artistService.getArtistById(id);
            if (!artist)
                return res.status(404).json({error: "User not found"});
            res.json(artist);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
};

module.exports = new ArtistController();