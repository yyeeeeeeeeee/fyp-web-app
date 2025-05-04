const express = require("express");

const trackController = require("../controllers/trackController");

const router = express.Router();

router.post("/", trackController.saveTrack);

router.get("/", trackController.getTrackById);

router.get("/playlist/:id", trackController.getTracksControl);

router.post("/playlist/:id/track/:id", trackController.saveTrackControl);

router.delete("/playlist/:id", trackController.deletePlaylistControl);

router.delete("/playlist/:id/track/:id", trackController.deleteTrackControl);

module.exports = router;