const mongoose = require("../configuration/dbConfig");

const userSchema = new mongoose.Schema({
    username: String,
    email:String,
    password: String,
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
    },
    image: {data: Buffer, contentType: String},
    isDeleted: Boolean,
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;