
const express = require("express");
const axios = require("axios");
const querystring = require("querystring");

const router = express.Router();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI; // e.g., http://localhost:3000/callback
const FRONTEND_URL = 'http://localhost:3000'; // Your React frontend URL


// 🔐 Step 1: Redirect to Spotify Authorization URL
router.get('/login', (req, res) => {
  const scope = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state'
  ].join(' ');
  

  const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI,
  })}`;

  res.redirect(authUrl);
});

// 🔄 Step 2: Callback Route - Exchange Code for Tokens
router.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  try {
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;
    console.log('🔑 Access Token Scopes:', accessToken);

    res.redirect(`${FRONTEND_URL}/player?access_token=${access_token}&refresh_token=${refresh_token}`);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.redirect(`${FRONTEND_URL}/error`);
  }
});

// 🔄 Step 3: Refresh Token Route
router.get('/refresh_token', async (req, res) => {
  const { refresh_token } = req.query;

  try {
    const refreshResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
      }
    );

    const { access_token } = refreshResponse.data;
    res.json({ access_token });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).send('Failed to refresh token');
  }
});

module.exports = router;
