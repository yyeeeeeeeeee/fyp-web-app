const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

router.post("/login", userController.login); //validate user

router.post("/register", userController.createUser); // register user

router.get("/:id", userController.getUserById); //retrieve user data

module.exports = router;