
// storing what query user had search before
// try to recommend the tracks to user

const mongoose = require("../configuration/dbConfig");

const searchHistorySchema = new mongoose.Schema({
    query: String,
    userId: String //foreign key
});

const searchHistory = mongoose.model("searchHistory", searchHistorySchema);

module.exports = searchHistory;