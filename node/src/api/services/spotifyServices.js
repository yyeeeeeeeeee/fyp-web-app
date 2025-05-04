
const getAccessToken = require("../configuration/spotifyConfig");

class spotifyServices {
    
  // Directories
    async getArtistsData(ids) {
      const token = await getAccessToken();
        const searchParameters = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      
        const artistResponse = await fetch(
          `https://api.spotify.com/v1/artists?ids=${ids}`,
          searchParameters
        );
        const artistData = await artistResponse.json();

        return artistData;
    }
    
    // Search Functions
    // Retrieve albums from a searched artist
    async searchArtistAlbums(searchInput) {
        const token = await getAccessToken();
        const searchParameters = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      
        const artistResponse = await fetch(
          `https://api.spotify.com/v1/search?q=${searchInput}&type=artist`,
          searchParameters
        );
        const artistData = await artistResponse.json();
        if (!artistData.artists.items.length) return [];

        const artistID = artistData.artists.items[0].id;
        const albumsResponse = await fetch(
          `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&limit=50`,
          searchParameters
        );
        const albumsData = await albumsResponse.json();
        return albumsData.items;
      }
      
    // Searches for spotify' playlists by keyword
    async searchPlaylists(searchInput) {
        const token = await getAccessToken();
        const searchParameters = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${searchInput}&type=playlist`,
          searchParameters
        );
        const data = await response.json();
        return data.playlists.items;
      }
      
    // Searches for tracks by keyword
    async searchTracks(searchInput) {
        const token = await getAccessToken();
        const searchParameters = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${searchInput}&type=track`,
          searchParameters
        );
        const data = await response.json();
        return data.tracks.items;
      }
    
    
    // Fetch detailed artist info
    async getArtistDetails() {
      const token = await getAccessToken();
        const searchParameters = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      
        const artistResponse = await fetch(
          `https://api.spotify.com/v1/search?q=${searchInput}&type=artist`,
          searchParameters
        );
        const artistData = await artistResponse.json();
        if (!artistData.artists.items.length) return [];

        const artistID = artistData.artists.items[0].id;

        const artist = await fetch(
          `https://api.spotify.com/v1/artists/${artistID}`, searchParameters
        );
        const data = await artist.json();
        console.log(data);
        return data;

    }

    // Artist Personnel Page Functions
    // Retrieve top tracks
    async getTopTracks(artistID) {
      const token = await getAccessToken();
        const searchParameters = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      
        const response = await fetch(
          `https://api.spotify.com/v1/artists/${artistID}/top-tracks`,
          searchParameters
        );
        const data = await response.json();
        return data;
    }

    // Retrieve Albums
    async getAlbums(artistID) {
      const token = await getAccessToken();
        const searchParameters = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      
        const response = await fetch(
          `https://api.spotify.com/v1/artists/${artistID}/albums`,
          searchParameters
        );
        const data = await response.json();
        return data;
    }


    // Retrieve related data
    // 1
    async getRelatedArtists(artistName) {
      const token = await getAccessToken();
        const searchParameters = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`,
          searchParameters
        );
        const data = await response.json();
        return data;
    }
    // 2
    async getRelatedPlaylists(artistName) {
      const token = await getAccessToken();
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
    
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=playlist`,
        searchParameters
      );
      const data = await response.json();
      return data;
    }
    // 3
    async getRelatedAlbums(artistName) {
      const token = await getAccessToken();
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
    
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=album`,
        searchParameters
      );
      const data = await response.json();
      return data;
    }
    // 4
    async getRelatedTracks(artistName) {
      const token = await getAccessToken();
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
    
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=track`,
        searchParameters
      );
      const data = await response.json();
      return data;
    }
}

module.exports = new spotifyServices();

