const express = require("express");

const userPlaylistController = require("../controllers/userPlaylistController");

const router = express.Router();

router.post("/", userPlaylistController.createUserPlaylist);

router.get("/u/:id", userPlaylistController.getUserPlaylistsByUserId);

router.get("/:id", userPlaylistController.getUserPlaylistById);

router.patch("/:id", userPlaylistController.updatePlaylist);

router.delete("/:id", userPlaylistController.deletePlaylist);

module.exports = router;