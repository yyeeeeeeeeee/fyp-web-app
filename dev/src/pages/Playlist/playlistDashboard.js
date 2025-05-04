import { Card, Col, Container, Image, Row, Button } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PencilSquare, PlusLg, Trash3Fill } from 'react-bootstrap-icons';
import "./playlistdashboard.css";

function DisplayPlaylist() {

    const [playlists, setPlaylist] = useState([]);
    const navigate = useNavigate();

    const { id } = useParams();

    const fetchPlaylist = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/playlist/u/${id}`);
            const data = await response.json();

            console.log("Fetched playlist data:", data);
            if (Array.isArray(data)) {
                setPlaylist(data);
            } else {
                console.warn("No playlists found or unexpected response:", data);
                setPlaylist([]); // fallback so `.map()` doesn't crash
            }
        } catch (error) {
            console.error("error while fetching playlists:", error.message);
        }
    }

    useEffect(() => {
        fetchPlaylist();
    }, []);

    const handleUpdate = (playlistId) => {
        navigate(`/u/${id}/playlist/${playlistId}`);
    }

    const handleAdd = () => {
        navigate(`/u/${id}/playlist`);
    }

    const handlePlaylistDetails = (playlistId) => {
        // localStorage.setItem('playlistId', playlistId);
        navigate(`/u/${id}/playlist/${playlistId}/playlist-details`, {state: {playlistId: playlistId}});
    }

    const handleDelete = async (playlistId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/playlist/${playlistId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.ok) {
                fetchPlaylist();
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
                        {playlists.map((playlist) => (
                            <Col key={playlist._id} xs={12} sm={6} md={4} lg={3}>
                                <Card className="custom-playlist-card" onClick={() => handlePlaylistDetails(playlist._id)}>
                                    <div className="icon-container">
                                        <PencilSquare
                                            className="icon edit-icon"
                                            onClick={() => handleUpdate(playlist._id)}
                                        />
                                        <Trash3Fill
                                            className="icon delete-icon"
                                            onClick={() => handleDelete(playlist._id)}
                                        />
                                    </div>

                                    <Card.Img
                                        src="/sea.jpg"
                                        className="custom-playlist-img"
                                    />

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
                                            {playlist.created_date}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}

                        {/* Add Playlist Card */}
                        <Col xs={12} sm={6} md={4} lg={3}>
                            <Card
                                className="add-card"
                                onClick={handleAdd}
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