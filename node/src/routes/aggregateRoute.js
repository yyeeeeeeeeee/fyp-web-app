const express = require("express");

const aggregateController = require("../controllers/aggregationController");

const router = express.Router();

router.post("/:id", aggregateController.getPlaylistsWithTracks);

module.exports = router;