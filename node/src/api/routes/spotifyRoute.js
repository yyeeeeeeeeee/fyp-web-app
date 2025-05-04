const express = require("express");

const spotifyController = require("../controllers/spotifyController");
const artistController = require ("../controllers/artistController");

const router = express.Router();

// Directories
router.get("/artists/:id", spotifyController.getArtistsData);

// Search
router.get("/artistablums", spotifyController.getArtistAlbums);

router.get("/playlists", spotifyController.getPlaylists);

router.get("/tracks", spotifyController.getTracks);

// Related 
router.get("/a/:id",artistController.getTopTrack);
router.get("/a/albums/:id",artistController.getAlbums);
router.get("/related-albums",artistController.getRelatedAlbums);
router.get("/related-artists", artistController.getRelatedArtists);
router.get("/related-playlists", artistController.getRelatedPlaylists);
router.get("/related-tracks", artistController.getRelatedTracks);

// New Releases Services
router.get("/new-releases", spotifyController.getNewReleases);

router.get("/album-info/:id",spotifyController.getAlbumInfo);

router.get("/album-tracks/:id",spotifyController.getAlbumTracks);

module.exports = router;