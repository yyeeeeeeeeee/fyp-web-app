// import { Container, Navbar, Nav } from 'react-bootstrap';
// import { useState } from 'react';

// import {SearchTrack, SearchArtistAlbum, SearchPlaylist} from './SearchAPI';

// function SearchDisplay() {
//   const [activeComponent, setActiveComponent] = useState(null);
//   const names = ['Tracks','Playlists','Albums'];

//   return (
//     <Container style={{marginTop: "20px"}}>
//       {/* Horizontal Function Bar */}
//       <Navbar bg="dark" variant="dark" expand="lg" className="justify-content-center">
//         <Nav>
//           <Nav.Link onClick={() => setActiveComponent("tracks")} className="mx-3">
//             Tracks
//           </Nav.Link>
//           <Nav.Link onClick={() => setActiveComponent("playlist")} className="mx-3">
//             Playlist
//           </Nav.Link>
//           <Nav.Link onClick={() => setActiveComponent("album")} className="mx-3">
//             Album
//           </Nav.Link>
//         </Nav>
//       </Navbar>

//       {/* Content Display Area */}
//       <Container className="mb-4" style={{backgroundColor: "yellow", height: "100vh", padding: "80px 0px"}}>
//         {activeComponent === "tracks" && <SearchTrack /> }
//         {activeComponent === "playlist" && <SearchPlaylist />}
//         {activeComponent === "album" && <SearchArtistAlbum />}
//       </Container>
//     </Container>
//   );
// }

// export default SearchDisplay;