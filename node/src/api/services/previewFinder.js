// The package automatically uses the environment variables for authentication
const spotifyPreviewFinder = require('spotify-preview-finder');

class previewFinder {
    async getPreviewURL(songname) {
        return await spotifyPreviewFinder(songname, 1);
    }

    async searchSongs() {
        const songs = [
            await spotifyPreviewFinder('Bohemian Rhapsody', 1),
            await spotifyPreviewFinder('Hotel California', 1),
            await spotifyPreviewFinder('Imagine', 1)
        ];
        return songs;
    }
}

module.exports = new previewFinder();