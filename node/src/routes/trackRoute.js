const express = require("express");

const trackController = require("../controllers/trackController");

const router = express.Router();

router.post("/tracks", trackController.saveTracks);

router.get("/track/:id", trackController.getTrackById);

router.get("/playlist/:id", trackController.getTracksControl);

router.post("/save-playlist", trackController.saveTracksControl);

router.delete("/playlist/:id", trackController.deletePlaylistControl);

router.delete("/playlist/:id/track/:id", trackController.deleteTrackControl);

module.exports = router;