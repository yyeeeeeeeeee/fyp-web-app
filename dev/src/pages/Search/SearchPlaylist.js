
// import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
// import { useState, useEffect } from 'react';
// //import {SPOTIFY_CONFIG} from '.../localStorage/spotifyAuth.js';

// const CLIENT_ID = 'b58f97e2f31249428194375fd2b32103';
// const CLIENT_SECRET = '1ee79e07e44d49a3a289b76157d96968';

// function SearchPlaylist() {
//   const [searchInput, setSearchInput] = useState("");
//   const [accessToken, setAccessToken] = useState("");
//   const [playlists, setPlaylists] = useState([]);
//   const [playlist, setPlaylist] = useState([]);

//   useEffect(() => {
//     // API Access Token
//     var authParameters = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
//     }
//     fetch('https://accounts.spotify.com/api/token', authParameters)
//       .then(result => result.json())
//       .then(data => setAccessToken(data.access_token))
//   },[])

//   //Search
//   async function search() {
//     console.log("Search for " + searchInput);

//     //Get request using search to get the Playlist ID
//     var searchParameters = {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + accessToken
//       }
//     }

//     var returnedPlaylists = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=playlist', searchParameters)
//       .then(response => response.json())
//       .then(data => {
//         console.log(data);
//         setPlaylists(data.playlists.items);
//       })
    
//     // Extracting all playlist IDs
//     const playlistIds = playlists.map(playlist => playlist.id);
//     console.log("tracks id:", playlistIds);

//     // var searchPlaylistById = await fetch('https://api.spotify.com/v1/playlists/' + playlistId + '/tracks', searchParameters)
//     //   .then(response => response.json())
//     //   .then(data => console.log(data))

//     console.log("returned playlists  are: ", playlists);
//   }

//   return (
//     <div className="SearchPlaylist" style={{margin: '10px'}}>
//       <Container>
//         <InputGroup className="mb-3" size="lg">
//           <FormControl 
//           placeholder="Search For Playlist" 
//           type="input" 
//           onKeyPress={event => {
//             if (event.key == "Enter") {
//               search();
//             }
//           }} 
//           onChange={ event => setSearchInput(event.target.value)}
//           />
//           <Button onClick={search}>
//             Search
//           </Button>
//         </InputGroup>
//       </Container>
//       <Container size="m">
//         <Row className="mx-2 row row-cols-4 text-start">
//           {playlists.map((playlist,i) => {
//             console.log(playlist); 
//             if (playlist) {
//                 return (
//                 <Card>
//                 <Card.Body>
//                   <Card.Img src={playlist.images[0].url} />
//                   <Card.Title>{playlist.name}</Card.Title>
//                   <Card.Subtitle>{playlist.owner.display_name}</Card.Subtitle>
//                 </Card.Body>
//                 </Card>
//             )
//             }
//           })}
//         </Row>     
//       </Container>
//     </div>
//   );
// }

// export default SearchPlaylist;
