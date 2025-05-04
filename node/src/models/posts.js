
// storing the posts

const mongoose = require("../configuration/dbConfig");

const postSchema = new mongoose.Schema({
    description: { type: String },
    created_date: { type: String, default: new Date().toLocaleDateString('ms-MY') }, // Example: "28/02/2025"
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Reference to User table
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;