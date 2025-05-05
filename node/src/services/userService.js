const mongoose = require("../configuration/dbConfig");
const User = require("../models/user");

class UserService {

    async login(email, uid) {
        return await User.findOne({ email: email, firebaseUid: uid });
    }

    async createUser(firebaseUid, username, email, password) {
        const newUser = new User({ firebaseUid, username, email, password });
        return await newUser.save();
    }

    async editUser(_id, username, email, image, contentType) {
        return await User.findByIdAndUpdate(
            _id, {
            username,
            email,
            image: {
                data: image,
                contentType: contentType,
            },
        }, { new: true }
        );
    }

    async getUserByUID(uid) {
        return await User.findOne({ firebaseUid: uid });
    }

    async getAllUsers() {
        return await User.find();
    }

    async getUserById(userId) {
        return await User.findById({
            _id: new mongoose.Types.ObjectId(userId)
        });
    }

    async updateUser(userId, updatedData) {
        return await User.findByIdAndUpdate({
            _id: new mongoose.Types.ObjectId(userId)
        },
            updatedData, { new: true })
    }

    async deleteUser(userId) {
        return await User.findByIdAndUpdate({
            _id: new mongoose.Types.ObjectId(userId)
        }, {
            isDeleted: true,
            deletedAt: new Date(),
        }
        );
    }
};

module.exports = new UserService();