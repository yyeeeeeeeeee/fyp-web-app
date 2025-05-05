
/*
Storing user saved tracks/songs data
will store half of the track data
some will through api fetch the data from spotify
to minimize the database data
*/

const mongoose = require("../configuration/dbConfig");

const trackSchema = new mongoose.Schema({
    trackId: String,
    name: String,
    artistId: String, // artist's spotify id for fetching later
    albumId: String, // storing album id to get the track in which album for fetching later
    image: String,
});

const Track = mongoose.model("Track", trackSchema);

module.exports = Track;