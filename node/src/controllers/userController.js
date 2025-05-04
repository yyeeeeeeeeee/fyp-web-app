const userService = require("../services/userService");
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

class UserController {

    async login(req, res) {
        try {
            const { email, password, firebaseUid } = req.body;

            const user = await userService.login(email, firebaseUid);

            if (!user) return res.status(404).json({ error: "User not found" }); // User not found

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid credentials" });
            }
            // const hashedPassword = await bcrypt.hash(password, 10); // 10 is a common default
            // if (password !== user.password) return res.status(400).json({ error: "Invalid credentials" });

            return res.status(200).json({ message: "Login successful", id: user._id });
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async createUser(req, res) {
        try {
            const { firebaseUid, username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10); // 10 is a common default
            const saveUser = await userService.createUser(firebaseUid, username, email, hashedPassword);
            res.status(201).json({
                message: "Register successful",
                user: saveUser
            });
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async editUser(req, res) {
        try {
            const { _id, username, email, image, contentType } = req.body;
            const imageBuffer = Buffer.from(image, "base64");

            const updateUser = await userService.editUser(_id, username, email, imageBuffer, contentType);
            if (!updateUser)
                res.status(404).json({ error: "Cannot update user", updateUser });
            res.status(201).json({
                message: "Updated successful",
                user: updateUser
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserByUID(req, res) {
        try {
            const uid = req.params.uid;
            const user = await userService.getUserByUID(uid);
            if (!user)
                return res.status(404).json({ message: "User not found" });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserById(req, res) {
        const userId = req.params.id; //get the id
        try {
            const user = await userService.getUserById(userId);
            if (!user)
                return res.status(404).json({ error: "User not found" });
            // res.json(user);

            // Check if image exists
            if (user.image?.data && user.image?.contentType) {
                const ext = user.image.contentType.split("/")[1]; // e.g. 'png'
                const uploadsDir = path.join(__dirname, "..", "..", "public", "uploads", `${user._id}.${ext}`);

                // Ensure the uploads directory exists
                if (!fs.existsSync(uploadsDir)) {
                    fs.mkdirSync(uploadsDir, { recursive: true });

                    const filePath = path.join(uploadsDir, `${user._id}.${ext}`);

                    // Write the binary image (not base64 string) to file
                    fs.writeFile(filePath, user.image.data, (err) => {
                        if (err) {
                            return res.status(500).json({ error: "Failed to save image in directory." });
                        }
                    });
                }

                return res.status(200).json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    image: `data:${user.image.contentType};base64,${user.image.data.toString("base64")}`,
                    imageUrl: `/uploads/${user._id}.${ext}`,
                });

            } else {
                // No image, respond without imageUrl
                return res.status(200).json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    image: null,
                    imageUrl: null,
                });
            }
        } catch (error) {
            console.error("Failed to get user: ", error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateUser(req, res) {
        const userId = req.params.id; //get the id
        const updatedData = req.body;

        try {
            const updatedUser = await userService.updateUser(userId, updatedData);
            if (!updatedUser)
                return res.status(404).json({ error: "User not found" });
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteUser(req, res) {
        const userId = req.params.id; //get the id
        try {
            const deletedUser = await userService.deleteUser(userId);
            if (!deletedUser)
                return res.status(404).json({ error: "User not found" });
            res.json({ message: "User deleted successfully ", user: deletedUser });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = new UserController();