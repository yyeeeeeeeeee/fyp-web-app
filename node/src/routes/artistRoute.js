const express = require("express");

const artistController = require("../controllers/artistController");

const router = express.Router();

router.get("/", artistController.getAllArtists);

router.get("/:id", artistController.getArtistById);


module.exports = router;