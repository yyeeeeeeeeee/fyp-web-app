const spotifyServices = require("../services/spotifyServices");

class relatedController {

    async getTopTrack(req, res) {
        const id = req.params.id;
        try {
            const toptracks = await spotifyServices.getTopTracks(id);
            if (!toptracks || toptracks.length === 0) {
                return res.status(404).json({ error: "No toptracks found." });
            }
            res.json(toptracks.tracks);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch toptracks." });
        }
    }

    async getAlbums(req, res) {
        const id = req.params.id;
        try {
            const albums = await spotifyServices.getAlbums(id);
            if (!albums || albums.length === 0) {
                return res.status(404).json({ error: "No albums found." });
            }
            res.json(albums);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch artist albums." });
        }
    }

    async getRelatedArtists(req, res) {
        const { artistName } = req.query;
        try {
            const artists = await spotifyServices.getRelatedArtists(artistName);
            if (!artists || artists.length === 0) {
                return res.status(404).json({ error: "No related artists found." });
            }
            res.json(artists.artists);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch related artists." });
        }
    }

    async getRelatedPlaylists(req, res) {
        const { artistName } = req.query;
        try {
            const playlists = await spotifyServices.getRelatedPlaylists(artistName);
            if (!playlists || playlists.length === 0) {
                return res.status(404).json({ error: "No related playlists found." });
            }
            res.json(playlists.playlists);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch related playlists." });
        }
    }

    async getRelatedAlbums(req, res) {
        const { artistName } = req.query;
        try {
            const albums = await spotifyServices.getRelatedAlbums(artistName);
            if (!albums || albums.length === 0) {
                return res.status(404).json({ error: "No related albums found." });
            }
            res.json(albums.albums);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch related albums." });
        }
    }

    async getRelatedTracks(req, res) {
        const { artistName } = req.query;

        try {
            const tracks = await spotifyServices.getRelatedTracks(artistName);
            if (!tracks || tracks.length === 0) {
                return res.status(404).json({ error: "No related tracks found." });
            }
            res.json(tracks.tracks);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch related tracks." });
        }
    }
}

module.exports = new relatedController(); 