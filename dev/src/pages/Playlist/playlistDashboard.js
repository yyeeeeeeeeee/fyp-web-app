import { Card, Col, Container, Row } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusLg, Trash3Fill } from 'react-bootstrap-icons';
import "./playlistdashboard.css";

function DisplayPlaylist({userId}) {

    const [playlists, setPlaylists] = useState([]);
    const navigate = useNavigate();

    const id  = userId || localStorage.getItem("userId");

    const getAllPlaylistsData = async() => {
        try {
            const respsone = await fetch(`http://localhost:5000/api/playlists-data/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await respsone.json();
            setPlaylists(data.playlistsWithTracks);

        } catch (error) {
            console.error("Error to get all playlists data: ", error.message);
        }
    }

    const fetchPlaylist = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/playlist/u/${id}`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            if (Array.isArray(data)) {
                setPlaylists(data);
            } else {
                console.warn("No playlists found or unexpected response:", data);
                setPlaylists([]); // fallback so `.map()` doesn't crash
            }
        } catch (error) {
            console.error("error while fetching playlists:", error.message);
        }
    }

    useEffect(() => {
        getAllPlaylistsData();
    }, []);

    const handleAdd = () => {
        navigate(`/u/${id}/playlist`);
    }

    const handlePlaylistDetails = (playlist) => {
        navigate(`/u/${id}/playlist/${playlist._id}/playlist-details`, {state: {playlist: playlist}});
    }

    const handleDelete = async (playlistId) => {
        try {
            if (window.confirm("Do you want to delete this playlist?")) {
                const response = await fetch(`http://localhost:5000/api/playlist/${playlistId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
                });
                if (response.ok) {
                    window.location.reload();
                }
            }    
        } catch (error) {
            console.error("error while deleting playlist:", error.message);
        }
    }

    return (
        <div className='custom-playlist-container'>
            <div className='custom-playlist-body'>
                <Container>
                    <Row className="gx-3 gy-4">
                        {playlists && playlists?.map((playlist) => (
                            <Col key={playlist._id} xs={12} sm={6} md={4} lg={3}>
                                <Card className="custom-playlist-card" onClick={() => handlePlaylistDetails(playlist)}>
                                    <div className="icon-container">
                                        <Trash3Fill
                                            className="icon delete-icon"
                                            size={24}
                                            onClick={() => handleDelete(playlist._id)}
                                        />
                                    </div>

                                    <div className="playlist-cover-grid">
                                            {playlist?.tracks.slice(0, 4).map((track, index) => (
                                                <img
                                                    key={index}
                                                    src={track.image}
                                                    alt={`track-${index}`}
                                                    className="playlist-cover-img"
                                                />
                                            ))}
                                    </div>


                                    <Card.Body>
                                        <Card.Title className="custom-playlist-title">
                                            {playlist.name}
                                        </Card.Title>
                                        <Card.Subtitle className="custom-playlist-desc">
                                            {playlist.description}
                                        </Card.Subtitle>
                                        {/* <Card.Text className="custom-playlist-meta">
                                            Created by: {playlist.userId}
                                        </Card.Text> */}
                                        <Card.Text className="custom-playlist-date">
                                            {playlist?.tracks?.length} Songs
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}

                        {/* Add Playlist Card */}
                        <Col xs={12} sm={6} md={4} lg={3}>
                            <Card
                                className="add-card"
                                onClick={() =>handleAdd()}
                            >
                                <div className="add-content">
                                    <PlusLg className="add-icon" />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};


export default DisplayPlaylist;