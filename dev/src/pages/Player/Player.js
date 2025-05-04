// import React, { useState, useEffect } from "react";
// import MusicPlayer from "./MusicPlayer";
// import PlayButton from "./PlayButton";
// import PlayerControls from "./PlayerControls";
// import { useNavigate } from "react-router-dom";
// <script src="https://sdk.scdn.co/spotify-player.js"></script>


// function Player() {
//     const [token, setToken] = useState('');
//     const [player, setPlayer] = useState(null);
//     const [deviceId, setDeviceId] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const id = localStorage.getItem('userId');

//     const handleLogin = async () => {
//         try{
//             const response = await fetch('http://localhost:5000/login');
//             const data = await response.json();
//             window.location.href = data.url;
//         } catch (error) {
//             console.error('Error fetching login URL:', error);
//         }
        
//     };

//     // Step 2: Handle token from callback URL
//     useEffect(() => {
//         const params = new URLSearchParams(window.location.search);
//         const code = params.get('code');
    
//         if (code) {
//             fetch(`http://localhost:5000/callback?code=${code}`)
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.accessToken) {
//                         setToken(data.accessToken);
//                         localStorage.setItem('spotify_token', data.accessToken); // Store securely
    
//                         // Navigate to home after successful token retrieval
//                         navigate(`/u/${id}/home`);
//                     } else {
//                         console.error('Error getting access token:', data.error);
//                     }
//                 })
//                 .catch(err => console.error('Error fetching token:', err));
//         }
//     }, [navigate, id]);
    

//     // Step 3: Initialize Web Playback SDK
//     useEffect(() => {
//         console.log(token);
//         if (!token) return;

//         window.onSpotifyWebPlaybackSDKReady = () => {
//             const player = new window.Spotify.Player({
//                 name: 'Web Player (Chrome)',
//                 getOAuthToken: cb => cb(token),
//                 volume: 0.5
//             });

//             player.addListener('ready', async({ device_id }) => {
//                 console.log('Ready with Device ID', device_id);
//                 setDeviceId(device_id);
//                 localStorage.setItem('device_id', device_id); 
//                 setLoading(false); //Stops loading spinner

//                 fetch(`https://api.spotify.com/v1/me/player`, {
//                     method: 'PUT',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         device_ids: [device_id],
//                         play: true
//                     })
//                 }).then(response => {
//                     if (response.status === 204) {
//                         console.log('Playback started successfully!');
//                     } else {
//                         console.error('Failed to start playback:', response.status);
//                     }
//                 }).catch(err => console.error('Error starting playback:', err));
//             });

//             player.addListener('not_ready', ({ device_id }) => {
//                 console.log('Device ID has gone offline', device_id);
//                 setLoading(false);
//             });

//             player.addListener('initialization_error', ({ message }) => {
//                 console.error('Initialization Error:', message);
//             });
            
//             player.addListener('authentication_error', ({ message }) => {
//                 console.error('Authentication Error:', message);
//             });
            
//             player.addListener('account_error', ({ message }) => {
//                 console.error('Account Error:', message);
//             });

//             player.connect().then(success => {
//                 if (success) {
//                     console.log('Player connected to Spotify!');
//                 }
//             });
//             setPlayer(player);
//         };
//     }, [token]);

//     return (
//         <div>
            
//             {token? (
//                 <div>
//                     <p>Spotify Connected 🎵</p>
//                     {deviceId ? (
//                         <p style={{color: "black"}}>Device ID: {deviceId}</p>
//                     ) : (
//                         <p style={{color:"black"}}>No active device found. Please open Spotify and start playing music.</p>
//                     )}
//                 </div>
//             ) : (<button onClick={handleLogin}>Login to Spotify</button>)}
//         </div>
//     );
// }

// export default Player;
