const spotifyServices = require("../services/spotifyServices");
const newReleasesServices = require("../services/newReleasesServices");

class spotifyController {
    
    // Directories
    async getArtistsData(req, res) {
        const ids = decodeURIComponent(req.params.id);
        try {
            const artists = await spotifyServices.getArtistsData(ids);
            if (!artists || artists.length === 0) {
                return res.status(404).json({ error: "Artists no found." });
            }            
            res.json(artists);
        } catch(error) {
            res.status(500).json({error: "Failed to fetch artists data."});
        }
    }

    // Search results
    // 1
    async getArtistAlbums(req,res) {
        const {searchInput} = req.query;
        try {
            const albums = await spotifyServices.searchArtistAlbums(searchInput);
            if (!albums || albums.length === 0) {
                return res.status(404).json({ error: "No artist albums found." });
            }            
            res.json(albums);
        } catch(error) {
            res.status(500).json({error: "Failed to fetch artist albums."});
        }
    }
    //2
    async getPlaylists(req,res) {
        const {searchInput} = req.query;
        try {
            const playlists = await spotifyServices.searchPlaylists(searchInput);
            if (!playlists || playlists.length === 0) {
                return res.status(404).json({ error: "No playlists found." });
            }            
            res.json(playlists);
        } catch(error) {
            res.status(500).json({error: "Failed to fetch playlists."});
        }
    }
    //3
    async getTracks(req,res) {
        const {searchInput} = req.query;
        try {
            const tracks = await spotifyServices.searchTracks(searchInput);
            if (!tracks || tracks.length === 0) {
                return res.status(404).json({ error: "No tracks found." });
            }       
            res.json(tracks);
        } catch(error) {
            res.status(500).json({error: "Failed to fetch tracks."});
        }
    }

    // Retrieve New Releases
    async getNewReleases(req,res) {
        try {
            const newReleases = await newReleasesServices.getNewReleases();
            if (!newReleases)
                return res.status(404).json({error: "No new releases found."});
            res.json(newReleases);
        } catch (error) {
            res.status(500).json({error: "Failed to fetch new releases."});
        }
    }

    // Retrieve an Album Tracks
    async getAlbumTracks(req, res) {
        try {
            const {id} = req.params;
            const albumTracks = await newReleasesServices.getAlbumTracks(id);
            if (!albumTracks || albumTracks.length == 0)
                return res.status(404).json({error: "No Tracks found."});
            res.json(albumTracks);
        } catch (error) {
            res.status(500).json({error: "Failed to fetch album tracks."});
        }
    }

    // Retrieve an Album Info
    async getAlbumInfo(req,res) {
        try {
            const {id} = req.params;
            const albumInfo = await newReleasesServices.getAlbumInfo(id);
            if (!albumInfo || albumInfo.length== 0)
                return res.status(404).json({error: "No Tracks found."});
            res.json(albumInfo);
        } catch (error) {
            res.status(500).json({error: "Failed to fetch album tracks."});
        }
    }

}

module.exports = new spotifyController();