import React, {useState, useEffect} from "react";
import apiClient from "../../spotify";
import "./library.css";
import { useParams, useNavigate } from "react-router-dom";
import { AiFillPlayCircle } from "react-icons/ai";
import { IconContext } from "react-icons";

function Library() {
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    apiClient.get("me/playlists").then(function(response) {
        setPlaylists(response.data.items);
        //console.log(response.data.items);
      });

  },[]);

  const navigate = useNavigate();
  const { id } = useParams();
  const playPlaylist = (playlistId) => {
    navigate(`/u/${id}/player`,{state: {id: playlistId, type: "playlist"}});
  }

  return(
    <div className="library-container">
      <div className="library-body">
        {playlists?.map((playlist) => (
          <div className="playlist-card" key={playlist.id} onClick={()=>playPlaylist(playlist.id)}>
            <img src={playlist.images[0].url} className="playlist-image" alt="Playlist-Art"/>
            <p className="playlist-title">{playlist.name}</p>
            <p className="playlist-subtitle">{playlist.tracks.total} Songs</p>
            <div className="playlist-fade">
              <IconContext.Provider value={{size:"50px", color:"#E9072"}}>
                <AiFillPlayCircle />
              </IconContext.Provider>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
  
export default Library;