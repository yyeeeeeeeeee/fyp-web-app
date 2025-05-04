const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

let accessToken = "";

async function getAccessToken() {
  if (accessToken) return accessToken; // Reuse token if already fetched

  const authParameters = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
  };

  const response = await fetch("https://accounts.spotify.com/api/token", authParameters);
  const data = await response.json();
  accessToken = data.access_token;
  return accessToken;
}

module.exports = getAccessToken;