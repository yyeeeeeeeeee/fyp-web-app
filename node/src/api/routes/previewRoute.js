const express = require("express");

const previewFinderController = require("../controllers/previewFinderController");

const router = express.Router();

router.get("/preview", previewFinderController.getPreviewURL);

module.exports = router;