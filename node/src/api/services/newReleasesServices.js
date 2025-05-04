const getAccessToken = require("../configuration/spotifyConfig");

class newReleasesServices {

    async getNewReleases() {
        const token = await getAccessToken();
        const searchParameters = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      
        const response = await fetch(
          `https://api.spotify.com/v1/browse/new-releases`,
          searchParameters
        );
        const data = await response.json();
        // return data.albums.items;
        return data;
    }

    async getAlbumTracks(id) {
      const token = await getAccessToken();
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(`https://api.spotify.com/v1/albums/${id}/tracks`, 
        searchParameters);
      const data = await response.json();
      return data;
      // return data.items;
    }

    async getAlbumInfo(id) {
      const token = await getAccessToken();
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, 
        searchParameters);
        const data = await response.json();
        // Return only essential data
        return data;
      //   return {
      //     images: data.images,
      //     name: data.name,
      //     release_date: data.release_date,
      //     artists: data.artists,
      //     total_tracks: data.total_tracks
      //  };
    }
}

module.exports = new newReleasesServices();