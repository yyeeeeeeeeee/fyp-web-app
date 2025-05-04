
const express = require("express");
const router = express.Router();

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URL
})

router.get('/login',(req,res) => {
    const scopes = 
    [
        'streaming',
        'user-read-private',
        'user-read-email',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'app-remote-control'
    ];
    console.log(spotifyApi);
    //res.redirect(spotifyApi.createAuthorizeURL(scopes));

    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    res.json({ url: authorizeURL });
})

router.get('/callback', (req,res)=> {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if (error) {
        console.error('Error:', error);
        //res.send(`Error: ${error}`);
        return;
    }

    spotifyApi.authorizationCodeGrant(code).then(data => {
        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];
        const expiresIn = data.body['expires_in'];

        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);

        console.log(accessToken, refreshToken);
        res.json({
            accessToken,
            refreshToken,
            expiresIn
        });
        //res.redirect(`http://localhost:3000/home?access_token=${access_token}`);
        //res.redirect(`http://localhost:3000/callback?success=true`);
        //res.send('Success!');

        //Refresh Token
        setInterval( async() => {
            const data = await spotifyApi.refreshAccessToken();
            const accessTokenRefreshed = data.body['access_token'];
            spotifyApi.setAccessToken(accessTokenRefreshed);
        }, expiresIn/2*1000);

    }).catch(error => {
        console.error('Error: ', error);
        //res.redirect(`http://localhost:3000/callback?success=false`);
        //res.send('Error getting token');
    });
})

router.get('/search', (req,res)=> {
    const {q} = req.query;
    spotifyApi.searchTracks(q).then(searchData => {
        const trackUri = searchData.body.tracks.items[0].uri;
        res.send({uri:trackUri});
        //redirect(`?q=${trackUri}`)
    }).catch (err => {
        res.send(`Error searching ${err}`);
    })
})

router.get('/play', async (req, res) => {
    await getActiveDevice();
    const { uri } = req.query;

    try {
        const devicesResponse = await spotifyApi.getMyDevices();
        const devices = devicesResponse.body.devices;

        if (!devices.length) {
            return res.send('❌ No active device found. Please open Spotify on your phone or PC.');
        }

        const activeDeviceId = devices[0].id;

        await spotifyApi.play({
            uris: [uri],
            device_id: activeDeviceId  // Auto-match active device
        });

        res.send('✅ Playback started');
    } catch (err) {
        console.error("Error playing track:", err);
        res.send(`Error playing ${err}`);
    }
});


module.exports = router;