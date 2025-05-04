const previewFinder = require("../services/previewFinder");

class previewFinderController {
    async getPreviewURL(req, res) {
        try {
        const songName = req.query.songname;
        
        const result = await previewFinder.getPreviewURL(songName);
        
        if (result.success) {
            result.results.forEach(song => {
            console.log(`\nSong: ${song.name}`);
            console.log(`Spotify URL: ${song.spotifyUrl}`);
            console.log('Preview URLs:');
            song.previewUrls.forEach(url => console.log(`- ${url}`));
            });
            res.json(result);
            // res.json(data.results[0].previewUrls[0]); 
        } else {
            console.error('Error:', result.error);
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new previewFinderController();