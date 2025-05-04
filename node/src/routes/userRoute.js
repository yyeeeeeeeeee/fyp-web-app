const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", userController.getAllUsers);

router.get("/:id", userController.getUserById);

router.get("/firebase/:uid", userController.getUserByUID);

router.patch("/:id", userController.editUser); //update user

router.delete("/:id", userController.deleteUser); //delete user

module.exports = router;