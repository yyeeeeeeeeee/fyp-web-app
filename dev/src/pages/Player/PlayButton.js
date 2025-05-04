import React from 'react';

async function transferPlaybackToWebPlayer(deviceId, accessToken) {
    await fetch("https://api.spotify.com/v1/me/player", {
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

async function playSong(trackUri, player) {
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


function PlayButton({ trackUri, player }) {
    const handlePlay = () => playSong(trackUri, player);

    return <button onClick={handlePlay}>▶️ Play</button>;
}

export default PlayButton;
