// backend/routes/spotifyAuth.js
const express = require("express");
const axios = require("axios");
const querystring = require("querystring");

const router = express.Router();

// Load these from .env
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

// LOGIN - Redirect to Spotify Authorization URL
router.get('/login', (req, res) => {
  const scope = [
    'streaming',
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'user-library-read'
  ].join(' ');

  const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
    show_dialog: true,
  })}`;

  res.redirect(authUrl);
});

// 2. CALLBACK - Exchange Code for Tokens
router.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.redirect(`${FRONTEND_URL}/error?message=NoCode`);
  }

  try {
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Redirect back to frontend with tokens in URL
    res.redirect(`${FRONTEND_URL}/home?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`);
  } catch (error) {
    console.error('Error exchanging code for tokens:', error.response?.data || error.message);
    res.redirect(`${FRONTEND_URL}/error?message=TokenError`);
  }
});

// 3. REFRESH_TOKEN - Refresh Access Token
router.get('/refresh_token', async (req, res) => {
  const { refresh_token } = req.query;

  if (!refresh_token) {
    return res.status(400).send('Missing refresh_token');
  }

  try {
    const refreshResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        client_id: CLIENT_ID,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
      }
    );

    const { access_token, expires_in } = refreshResponse.data;

    res.json({ access_token, expires_in });
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    res.status(500).send('Failed to refresh token');
  }
});

module.exports = router;
