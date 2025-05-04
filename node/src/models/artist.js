const mongoose = require("../configuration/dbConfig");

const artistSchema = new mongoose.Schema({
    artistID: String,
    name: String,
});

const Artist = mongoose.model("Artist", artistSchema);

module.exports = Artist;