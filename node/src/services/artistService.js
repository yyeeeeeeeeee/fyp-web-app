
const Artist = require("../models/artist");

class ArtistService {

    async getAllArtists() {
        return await Artist.find();
    }

    async getArtistById(id) {
        return await Artist.find(id);
    }

    async saveArtists(artistList) {
        const newArtists = [];

        for (const artist of artistList) {
            const exists = await Artist.findOne({ artistID: artist.artistID });
            if (!exists) {
                newArtists.push(artist);
            }
        }

        if (newArtists.length > 0) {
            return await Artist.insertMany(newArtists);
        } else {
            return []; // or null if you prefer
        }
    }

};

module.exports = new ArtistService();