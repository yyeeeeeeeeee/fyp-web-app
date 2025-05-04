
const User = require("../models/user");

class UserService {

    async login(email, uid) {
        return await User.findOne({email: email, firebaseUid: uid});
    }

    async createUser(firebaseUid, username, email, password) {
        const newUser = new User({firebaseUid, username, email,  password});
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
            }, {new: true}
        );
    }

    async getUserByUID(uid) {
        return await User.find({firebaseUid: uid});
    }

    async getAllUsers() {
        return await User.find();
    }

    async getUserById(userId) {
        return await User.findById(userId);
    }

    async updateUser(userId, updatedData) {
        return await User.findByIdAndUpdate(userId, updatedData, {
            new:true
        })
    }

    async deleteUser(userId) {
        return await User.findByIdAndDelete(userId);
    }
};

module.exports = new UserService();