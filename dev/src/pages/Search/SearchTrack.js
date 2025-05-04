
// import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
// import { useState, useEffect } from 'react';
// //import {SPOTIFY_CONFIG} from '.../localStorage/spotifyAuth.js';

// const CLIENT_ID = 'b58f97e2f31249428194375fd2b32103';
// const CLIENT_SECRET = '1ee79e07e44d49a3a289b76157d96968';

// function SearchTrack() {
//   const [searchInput, setSearchInput] = useState("");
//   const [accessToken, setAccessToken] = useState("");
//   const [trackList, setTrackList] = useState([]);

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

//     //Get request using search to get the tacks
//     var searchParameters = {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + accessToken
//       }
//     }

//     var returnedTracks = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=track', searchParameters)
//       .then(response => response.json())
//       .then(data => {setTrackList(data.tracks.items)})
//     console.log("returned tracks id are: ", trackList);

//     // Extracting all track IDs
//     const trackIds = trackList.map(track => track.id);
//     console.log("tracks id:", trackIds);

//     var tracks = await fetch('https://api.spotify.com/v1/tracks?ids=' + trackIds + '&limit=20', searchParameters)
//       .then(response => response.json())
//       .then(data => console.log(data))
//   }

//   return (
//     <div className="SearchTrack" style={{margin: '10px'}}>
//       <Container>
//         <InputGroup className="mb-3" size="lg">
//           <FormControl 
//           placeholder="Search For Track" 
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
//         <Row className="mx-2 row text-start">
//           {trackList.map((track,i) => {
//             console.log(track);
//             return (
//               <Card>
//               <Card.Body>
//                 <Card.Title>{track.name}</Card.Title>
//                 <Card.Subtitle>
//                   {track.artists.map((artist) => artist.name).join(", ")}
//                 </Card.Subtitle>

//               </Card.Body>
//               </Card>
//             )
//           })}
//         </Row>     
//       </Container>
//     </div>
//   );
// }

// export default SearchTrack;
