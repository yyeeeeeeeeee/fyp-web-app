const CLIENT_ID = 'b58f97e2f31249428194375fd2b32103';
const CLIENT_SECRET = '1ee79e07e44d49a3a289b76157d96968';

let accessToken = "";

export async function getAccessToken() {
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

export async function searchArtistAlbums(searchInput) {
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
    `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`,
    searchParameters
  );
  const albumsData = await albumsResponse.json();
  return albumsData.items;
}

export async function searchPlaylists(searchInput) {
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

export async function searchTracks(searchInput) {
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
