const express = require("express");

const chatController = require("../controllers/chatController");

const router = express.Router();

router.post("/", chatController.createChat);

router.get("/find/:firstId/:secondId", chatController.findChat);

router.get("/:userId", chatController.findUserChats);

module.exports = router;