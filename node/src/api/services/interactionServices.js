const getAccessToken = require("../configuration/spotifyConfig");

class interactionServices {

  async transferPlaybackToWebPlayer(deviceId, accessToken) {
    const token = await getAccessToken();
    const response = await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            device_ids: [deviceId],
            play: true
        })
    });
}

async playSong(trackUri, player) {
  const token = await getAccessToken();
    await player._options.getOAuthToken(async token => {
        await transferPlaybackToWebPlayer(player._options.id, token);

        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${player._options.id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uris: [trackUri]
            })
        });
    });
}

    // Get the current playback state
    async getPlaybackState() {
        const token = await getAccessToken();
        const searchParameters = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await fetch("https://api.spotify.com/v1/me/player",searchParameters);
        const data = await response.json();
        return data.item;
    }

    // Get available devices
    async getDevices() {
        const token = await getAccessToken();
        const searchParameters = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await fetch("https://api.spotify.com/v1/me/player/devices",searchParameters);
        const data = await response.json();
        return data.devices;
    }

    // Pauses the current playback session
    async pausePlayback() {
        const token = await getAccessToken();
        const searchParameters = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await fetch("https://api.spotify.com/v1/me/player/pause",searchParameters);
        const data = await response.json();
        return data;
    }

    // Resumes playback from pause
    async resumePlayback(trackUri,offset,positionms) {
        const token = await getAccessToken();
        const searchParameters = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: {
            "context_uri": trackUri,
            "offset": {offset},
            "position_ms": positionms
          }
        };
        const response = await fetch("https://api.spotify.com/v1/me/player/play",searchParameters);
        const data = await response.json();
        return data;
    }

    // Skips to the next track
    async skipToNext() {
        const token = await getAccessToken();
        const searchParameters = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await fetch("https://api.spotify.com/v1/me/player/next",searchParameters);
        const data = await response.json();
        return data;
    }

    // Skips to the previous track
    async skipToPrevious() {
        const token = await getAccessToken();
        const searchParameters = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await fetch("https://api.spotify.com/v1/me/player/previous",searchParameters);
        const data = await response.json();
        return data;
    }
}

module.exports = new interactionServices();