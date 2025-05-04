
const Artist = require("../models/artist");

class ArtistService {

    async getAllArtists() {
        return await Artist.find();
    }

    async getArtistById(id) {
        return await Artist.find(id);
    }

};

module.exports = new ArtistService();