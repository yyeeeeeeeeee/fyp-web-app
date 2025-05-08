
import { Container, Row, Card, Navbar, Nav } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./searchresults.css";
import { PlayCircleFill } from "react-bootstrap-icons";

function SearchResults({userId}) {
  const [activeComponent, setActiveComponent] = useState("tracks");
  const searchTabs = ["Tracks", "Playlists", "Albums"];

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || ""; // Get search term from URL

  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);

  const id = userId || localStorage.getItem("userId") || "";
  const navigate = useNavigate();

  useEffect(() => {
    handleAlbums(query);
    handlePlaylists(query);
    handleTracks(query);
  }, [query]);

  const handleAlbums = async (searchInput) => {
    try {
      const response = await fetch(`https://fyp-web-app-sgso.onrender.com/api/spotify/artistablums?searchInput=${searchInput}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json(response);
      setAlbums(data);

    } catch (error) {
      console.error(error.message);
    }
  }

  const handlePlaylists = async (searchInput) => {
    try {
      const response = await fetch(`https://fyp-web-app-sgso.onrender.com/api/spotify/playlists?searchInput=${searchInput}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json(response);
      setPlaylists(data);

    } catch (error) {
      console.error(error.message);
    }
  }
  const handleTracks = async (searchInput) => {
    try {
      const response = await fetch(`https://fyp-web-app-sgso.onrender.com/api/spotify/tracks?searchInput=${searchInput}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json(response);
      setTracks(data);

    } catch (error) {
      console.error(error.message);
    }
  }


  const setDisplay = (searchtab) => {
    if (searchtab === "Tracks") {
      setActiveComponent("tracks")
    }
    if (searchtab === "Playlists") {
      setActiveComponent("playlists")
    }
    if (searchtab === "Albums") {
      setActiveComponent("albums")
    }
  }

  const handleNext = (data, type) => {
    if (id)
      navigate(`/u/${id}/player`,{state: {id: data.id, type: type}});
    else
      navigate(`/login`);
  }

  // console.log(albums, tracks, playlists);

  return (
    <div className="search-results-container">

      {/* Horizontal Function Bar */}
      <div className="search-tab-container">
        {searchTabs.map((tab, i) => (
          <div className={`search-tab ${activeComponent === tab.toLowerCase() ? 'active-tab' : ''}`} key={i}
            onClick={() => setDisplay(tab)}
          >
            <p>{tab}</p>
          </div>
        ))}
      </div>

      <div className="search-body">
        {activeComponent === "tracks" &&
          <Container>
            <Row>
              <div className="search-track-container">
                <Container size="m">
                  <Row className="mx-2 row text-start">
                    {tracks?.map((track, i) => (
                      //console.log(track);
                      <Card key={track?.id} className="track-card" onClick={()=> handleNext(track, "track")}>
                        <div className="card-content">
                          <PlayCircleFill className="play-icon" />
                          <div className="track-card-body">
                            <Card.Body>
                              <Card.Title style={{ fontWeight: "600", color: "#424040" }}>{track?.name}</Card.Title>
                              <Card.Subtitle style={{ fontWeight: "500", color: "#484545" }}>
                                {track?.artists?.map((artist) => artist?.name).join(", ")}
                              </Card.Subtitle>
                            </Card.Body>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </Row>
                </Container>
              </div>
            </Row>
          </Container>
        }

        {activeComponent === "playlists" &&
          <Container>
            <div className="search-playlist-grid">
              {playlists?.filter(p => p).map((playlist, i) => (
                <div key={playlist?.id} className="search-playlist-grid-item">
                  <Card className="search-playlist-card" onClick={()=> handleNext(playlist, "playlist")}>
                    <Card.Img variant="top" src={playlist?.images[0]?.url} className="search-playlist-img" />
                    <Card.Body>
                      <Card.Title>{playlist?.name}</Card.Title>
                      <Card.Subtitle className="text-muted">{playlist?.owner?.display_name}</Card.Subtitle>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </Container>
        }

        {activeComponent === "albums" &&
          <Container>
            <div className="search-album-grid">
              {albums?.map((album) => (
                <div key={album?.id} className="search-album-grid-item">
                  <Card className="search-album-card" onClick={()=> handleNext(album, "album")}>
                    <Card.Img src={album?.images[0]?.url} className="search-album-img" />
                    <Card.Body>
                      <Card.Title>{album?.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </Container>
        }
      </div>
    </div>
  );
}


export default SearchResults;
