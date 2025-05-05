import { useEffect, useState } from "react";
import { Card, Container, Image, Row, Col } from "react-bootstrap";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { PencilSquare, PlayCircleFill, PlusSquare, Share } from "react-bootstrap-icons";
import "./playlistdetails.css";

function PlaylistDetails({userId}) {
    const  id  = userId || localStorage.getItem("userId");
    const location = useLocation();
    const navigate = useNavigate();
    const playlist = location.state.playlist;

    const handleAccessPlaylist = (playlist) => {
        navigate(`/u/${id}/player`, { state: { playlist: playlist, type: "own" } });
    }

    const handleAccessTrack = (track) => {
        navigate(`/u/${id}/player`, { state: { playId: track.trackId, type: "track" } });
    }

    const handleEdit = (playlist) => {
        navigate(`/u/${id}/playlist/${playlist._id}`, { state: { playlist: playlist } });
    }

    return (
        <div className="playlist-detail-container">
            <div className="playlist-header">
                <div className="playlist-info">
                    <Row className="align-items-flex-start">
                        <Col xs="auto">
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
                        </Col>
                        <Col className="playlist-info-bar">
                            <p className="playlist-name">{playlist?.name}</p>
                            <p className="playlist-desc">{playlist?.description}</p>
                        </Col>
                        <Col xs="auto" className="text-end">
                            <PencilSquare role="button" className="text-end mb-4" size={20} 
                                onClick={() => handleEdit(playlist)}
                            />
                            <div></div>
                            <PlayCircleFill size={50} className="text-end me-2" role="button" 
                                onClick={() => handleAccessPlaylist(playlist)}
                            />
                        </Col>
                    </Row>
                </div>
            </div>

            <div className="playlist-tracks-container">
                <div className="playlist-tracks-header">
                    Tracks
                </div>
                {playlist?.tracks?.map((track, index) => (
                    <Card key={track?.id || index} className="track-card" onClick={() => handleAccessTrack(track)} >
                        <Card.Text className="playlist-track-idx"># {index + 1}</Card.Text>
                        <Card.Img src={track?.image} alt="Track Image" className="track-image me-3" />
                        <div className="track-info">
                            <Card.Text className="track-name">{track?.name}</Card.Text>
                            <Card.Text className="track-artist">{track?.artist?.name}</Card.Text>
                        </div>
                        <PlayCircleFill size={60} className="to-play-btn" role="button" />
                    </Card>
                ))}

            </div>
        </div>
    );
}

export default PlaylistDetails;