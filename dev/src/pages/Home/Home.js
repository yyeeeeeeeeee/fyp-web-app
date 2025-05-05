import { Container, InputGroup, FormControl, Button, Image, Card, Row, Col } from 'react-bootstrap';
import { useRef, useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Compass, ChatDots, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import "./home.css";

function Home() {
  const { id } = useParams();
  const [newReleases, setNewReleases] = useState([]);
  const cardContainerRef = useRef(null);
  const [isCardMoveRight, setIsCardMoveRight] = useState(false);
  const [isCardMoveLeft, setIsCardMoveLeft] = useState(false);
  const navigate = useNavigate();

  const [recomPlaylists, setRecomPlaylists] = useState({});
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  const [firstPlaylist, setFirstPlaylsit] = useState({});
  const [generalTop20, setGeneralTop20] = useState([]);


  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/spotify/new-releases");  // Use `userId
        const data = await response.json();
        if (!response.ok)
          console.log("Error fetching new releases data");
        if (data)
          setNewReleases(data?.albums?.items);
      } catch (error) {
        console.error("Error fetching new releases:", error.message);
      }
    };
    fetchNewReleases();
  }, []);


  const handleScrollRight = () => {
    if (cardContainerRef.current) {
      cardContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollLeft = () => {
    if (cardContainerRef.current) {
      cardContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    const container = cardContainerRef.current;

    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      setIsCardMoveLeft(container.scrollLeft > 10);
      setIsCardMoveRight(container.scrollLeft < maxScrollLeft - 10);
    }
  };

  useEffect(() => {
    const container = cardContainerRef.current;

    if (container) {
      setTimeout(handleScroll, 100);  // Slight delay for layout stabilization
      container.addEventListener("scroll", handleScroll);
    };

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const customRecommendation = async () => {
      try {
        const cachedData = localStorage.getItem('recommendations');
        if (cachedData) {
          setRecomPlaylists(JSON.parse(cachedData)); // Use cached recommendations
          return;
        }
        const response = await fetch("http://localhost:8000/recommendations"); //get customized recommendations
        const data = await response.json();

        if (!response.ok) throw new Error("Response not OK");

        if (data) {
          localStorage.setItem('recommendations', JSON.stringify(data)); // Cache recommendations
          setRecomPlaylists(data);

          // Process the playlist data once it's fetched
          const firstPlaylist = data[Object.keys(data)[0]]; // Access the first playlist
          setFirstPlaylsit(firstPlaylist);

          // Get the top 20 songs
          const generalTop20 = firstPlaylist?.top40?.slice(0, 20) || [];
          setGeneralTop20(generalTop20);
        }

      } catch (error) {
        console.error("Error fetching customized recommendations: ", error.message);
      } finally {
        setLoading(false);
      }
    };

    customRecommendation();
  }, []);

  useEffect(() => {
    if (recomPlaylists && Object.keys(recomPlaylists).length > 0) {
      const firstKey = Object.keys(recomPlaylists)[0];
      const firstPlaylist = recomPlaylists[firstKey];
  
      setFirstPlaylsit(firstPlaylist);
  
      const generalTop20 = firstPlaylist?.top40?.slice(0, 20) || [];
      setGeneralTop20(generalTop20);
    }
  }, [recomPlaylists]);


  const handleAccessAlbum = (albumId) => {
    navigate(`/u/${id}/player`, { state: { playId: albumId, type: "album" } });
  }

  const handleAccessRecomData = (track) => {
    navigate(`/u/${id}/player`, { state: { playId: track.track_id, type: "track" } });
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', overflow: "hidden" }}>
      {/* Left Sidebar */}
      <div className="sidebar-component" style={{ backgroundColor: "#1A1A2E", padding: "20px 0px", width: "250px", flexShrink: 0 }}>
        <Container className='sidebar'>

          {/* Space Div for Top Padding */}
          <div style={{ height: '40px', borderBottom: '2px solid #3B3E47' }}></div>

          <Col className="bg-dark text-white p-4" style={{ width: '100%' }}>
            <Nav className="text-center flex-column" style={{ gap: '20px', fontSize: '18px' }}>
              {
                (id !== undefined) ?
                  <div>
                    <Nav.Link as={Link} to={`/u/${id}/explore`} className="custom-nav-item"><Compass /> Explore Libraries </Nav.Link>
                    <Nav.Link as={Link} to={`/u/${id}/social`} className="custom-nav-item"><ChatDots /> Social Everywhere</Nav.Link>
                  </div> :
                  <div>
                    <Nav.Link as={Link} to={`/explore`} className="custom-nav-item"><Compass /> Explore Libraries </Nav.Link>
                    {/* <Nav.Link as={Link} to={`/social`} className="custom-nav-item"><ChatDots /> Social Everywhere</Nav.Link> */}
                  </div>
              }
            </Nav>
          </Col>
        </Container>
      </div>
      {/* Right Side (Main Content) */}
      <div style={{ flex: 1, backgroundColor: "#F0F2F5", padding: "20px" }}>
        <Container className="content-section mb-4">
          <h3 className='content-title'>New Releases</h3>
          <div className="scroll-container" style={{ position: 'relative' }}>
            {isCardMoveLeft && (
              <button className="scroll-arrow-left" onClick={handleScrollLeft}>
                <ChevronLeft size={24} />
              </button>
            )}
            <div ref={cardContainerRef} className='card-container'>
              {(newReleases?.length > 0) ? newReleases.map((newRelease, i) => (
                <Card className="custom-card" key={i} onClick={(() => { handleAccessAlbum(newRelease.id); })}>
                  <Card.Img src={newRelease?.images[0].url} />
                  <Card.Body>
                    <Card.Title>{newRelease?.name}</Card.Title>
                    <Card.Subtitle>{newRelease?.artists?.map((artist) => artist?.name).join(', ')}</Card.Subtitle>
                  </Card.Body>
                </Card>
              )) : ""}
            </div>
            {isCardMoveRight && (
              <button className="scroll-arrow-right" onClick={handleScrollRight}>
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </Container>

        {id !== undefined && id !== null && (
          <div>
            <Container className="content-section mb-4">
              <h3 className='content-title'>Recommendation to you...</h3>
              <div className="scroll-container" style={{ position: 'relative' }}>
                {isCardMoveLeft && (
                  <button className="scroll-arrow-left" onClick={handleScrollLeft}>
                    <ChevronLeft size={24} />
                  </button>
                )}
                <div ref={cardContainerRef} className='card-container'>
                  {loading ?
                    <div>Trying to loading...</div>
                    : generalTop20?.length > 0 ? generalTop20.map((track, i) => (
                      <Card className="custom-card" key={i} onClick={() => handleAccessRecomData(track)}>
                        <Card.Img src={track?.url} />
                        <Card.Body>
                          <Card.Title>{track?.track_name}</Card.Title>
                          <Card.Subtitle>{track?.track_artist}</Card.Subtitle>
                        </Card.Body>
                      </Card>
                    )) : <p>Loading recommendations or no results.</p>
                  }
                </div>
                {isCardMoveRight && (
                  <button className="scroll-arrow-right" onClick={handleScrollRight}>
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>
            </Container>
            {/* 
            <Container className="content-section mb-4">
              <h3 className='content-title'>You might also like...</h3>
              <div className="scroll-container" style={{ position: 'relative' }}>
                {isCardMoveLeft && (
                  <button className="scroll-arrow-left" onClick={handleScrollLeft}>
                    <ChevronLeft size={24} />
                  </button>
                )}
                <div ref={cardContainerRef} className='card-container'>
                  {loading ? (
                    <div>Loading...</div>
                  ) : Object.entries(groupedByGenre).length > 0 ? (
                    Object.entries(groupedByGenre).map(([genre, tracks]) => (
                      <div key={genre} className="genre-section">
                        <h4>{genre}</h4>
                        {Array.isArray(tracks) && tracks.length > 0 ? (
                          tracks.map((track, i) => (
                            <Card className="custom-card" key={i} onClick={() => "console.log(track)"}>
                              <Card.Img src={track.url} alt={track.track_name} />
                              <Card.Body>
                                <Card.Title>{track.track_name}</Card.Title>
                                <Card.Subtitle>{track.track_artist}</Card.Subtitle>
                                <Card.Subtitle>{track.track_album_release_date}</Card.Subtitle>
                              </Card.Body>
                            </Card>
                          ))
                        ) : (
                          <p>No tracks available in this genre.</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>Loading recommendations or no results.</p>
                  )}
                </div>
                {isCardMoveRight && (
                  <button className="scroll-arrow-right" onClick={handleScrollRight}>
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>
            </Container> */}

          </div>
        )}

        {/* <Container className="content-section mb-4">
          <h3>Recommendations</h3>
          <div className="scroll-container" style={{ position: 'relative' }}>
            {isCardMoveLeft && (
              <button className="scroll-arrow-left" onClick={handleScrollLeft}>
                <ChevronLeft size={24} />
              </button>
            )}
            <div ref={cardContainerRef} className='card-container'>
              {loading ?
                <div>Loading...</div>
                : (Object.keys(recomPlaylists).length > 0) ?
                Object.entries(recomPlaylists).map(([playlistId, data], idx) => (
                    <div key={idx} className="mb-5">
                      <h4 className="mb-3">Playlist ID: {playlistId}</h4>
                      <div className="row">
                      {Array.isArray(data?.top40) && data.top40.map((track, i) => (
                          <div className="col-md-3 mb-4" key={i}>
                            <div
                              className="card h-100"
                              onClick={() => setSelectedTrack(track)}
                              style={{ cursor: "pointer" }}
                            >
                              <img src={track.url} className="card-img-top" alt={track.track_name} />
                              <div className="card-body">
                                <h5 className="card-title">{track.track_name}</h5>
                                <p className="card-text">{track.track_artist}</p>
                                <p className="card-text">{track.track_album_release_date}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                  : <p>Loading recommendations or no results.</p>}
            </div>
            {isCardMoveRight && (
              <button className="scroll-arrow-right" onClick={handleScrollRight}>
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </Container> */}

      </div>

    </div>
  );
}

export default Home;