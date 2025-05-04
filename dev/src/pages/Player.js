// import React, { useEffect, useState } from "react";
// import { Rnd } from "react-rnd";
// import { Play, Pause, Minimize2, Maximize2, SkipBack, SkipForward, Music } from "react-feather";
// import "./musicPlayer.css";

// const MusicPlayer = () => {
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [isHidden, setIsHidden] = useState(true);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [playTrackId, setPlayTrackId] = useState(null);
  
//   const songTitle = "Blinding Lights";
//   const artistName = "The Weeknd";

//   useEffect(() => {
//     const handleLogin = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/api/login');
//             const data = await response.json();
//         } catch (error) {
//             console.error("Error login to spotify music:", error.message);
//         }
//     };
//     //handleLogin();

//   });

//   const handleURI = async (query) => {
//     try {
//         const response = await fetch(`http://localhost:5000/api/search?q=${query}`);
//         const data = await response.json();
//         if (response.ok)
//             setPlayTrackId(data.uri);
//     } catch (error) {
//         console.error("Error fetching query:", error.message);
//     }
//   }

//   const handlePlay = async (uri) => {
//     try {
//         const response = await fetch(`http://localhost:5000/api/play?uri=${uri}`);
//         const data = await response.json();
//         if (response.ok)
//             setIsPlaying(true);
//     } catch (error) {
//         console.error("Error playing music:", error.message);
//     }
//   }

  

//   return (
//     <>
//       {/* Draggable Music Icon (When Hidden) */}
//       {isHidden && (
//         <Rnd
//           default={{ x: window.innerWidth - 200, y: 100, width: 60, height: 60 }}
//           minWidth={60}
//           minHeight={60}
//           maxWidth={60}
//           maxHeight={60}
//           bounds="body"
//           dragAxis="both"
//           className="player-icon shadow"
//         >
//           <div
//             className="d-flex align-items-center justify-content-center w-100 h-100"
//             onClick={() => setIsHidden(false)}
//           >
//             <Music size={28} />
//           </div>
//         </Rnd>
//       )}

//       {/* Full Music Player */}
//       {!isHidden && (
//         <Rnd
//           default={{ x: window.innerWidth - 400, y: 100, width: 320, height: isMinimized ? 60 : 200 }}
//           minWidth={250}
//           minHeight={60}
//           bounds="body"
//           enableResizing={{ bottomLeft: true, bottomRight: true }}
//           dragHandleClassName="music-player-header"
//           className="music-player shadow-lg rounded"
//         >
//           <div className="music-player-header d-flex justify-content-between align-items-center p-2 bg-dark text-white">
//             <span className="fw-bold">Music Player</span>
//             <div>
//               <button
//                 className="btn btn-sm btn-outline-light me-2"
//                 onClick={() => setIsMinimized(!isMinimized)}
//               >
//                 {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
//               </button>
//               <button className="btn btn-sm btn-outline-light" onClick={() => setIsHidden(true)}>
//                 ✖
//               </button>
//             </div>
//           </div>

//           {!isMinimized && (
//             <div className="player-body p-3 bg-light">
//               <div className="track-info text-center">
//                 <div className="song-title fw-bold">{songTitle}</div>
//                 <div className="artist-name text-muted">{artistName}</div>
//               </div>
//               <div className="controls d-flex justify-content-center mt-3">
//                 <button className="btn btn-light mx-2"><SkipBack size={20} /></button>
//                 <button className="btn btn-primary mx-2" onClick={() => setIsPlaying(!isPlaying)}>
//                   {isPlaying ? <Pause size={22} /> : <Play size={22} />}
//                 </button>
//                 <button className="btn btn-light mx-2"><SkipForward size={20} /></button>
//               </div>
//             </div>
//           )}
//         </Rnd>
//       )}
//     </>
//   );
// };

// export default MusicPlayer;
