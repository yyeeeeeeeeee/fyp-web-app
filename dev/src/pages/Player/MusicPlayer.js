// import { useEffect, useState } from "react";
// import "https://sdk.scdn.co/spotify-player.js";

// function SpotifyPlayer({ accessToken }) {
//     const [player, setPlayer] = useState(null);
//     const [deviceId, setDeviceId] = useState(null);

//     useEffect(() => {
//         window.onSpotifyWebPlaybackSDKReady = () => {
//             const playerInstance = new window.Spotify.Player({
//                 name: "BTNE Player",
//                 getOAuthToken: cb => cb(accessToken),
//                 volume: 0.5
//             });

//             setPlayer(playerInstance);

//             // Player state listeners
//             playerInstance.addListener("ready", ({ device_id }) => {
//                 console.log("✅ Player Ready with Device ID:", device_id);
//                 setDeviceId(device_id);
//             });

//             playerInstance.addListener("not_ready", ({ device_id }) => {
//                 console.error("❌ Device ID has gone offline", device_id);
//             });

//             playerInstance.connect();
//         };
//     }, [accessToken]);

//     return (
//         <div>
//             <h2>Spotify Web Player</h2>
//             {deviceId ? <p>🎧 Device Active: {deviceId}</p> : <p>🔄 Connecting...</p>}
//         </div>
//     );
// }

// export default SpotifyPlayer;
