import { useEffect, useState } from "react";
import { Card, Container, Image, Row, Col } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import { PencilSquare, PlayCircleFill, PlusSquare, Share } from "react-bootstrap-icons";

function PlaylistDetails() {
    const {id} = useParams();
    const location = useLocation();
    const playlistId = location.state.playlistId;
    const [tracks,setTracks] = useState([]);
    const [owner, setOwner] = useState(null);

    useEffect(()=> {

        const fetchPlaylistItems = async() => {
            try {
                const response = await fetch(`http://localhost:5000/api/playlist-tracks/playlist/${playlistId}`);
                const data = await response.json();
                if (!data.success)
                    console.log("Tracks no found in this playlist");
                setTracks(data);
            } catch (error) {
                console.error("Failed fetching tracks of this playlist: ", error);
            }
        }

        const fetchOwnerInfo = async() => {
            try {
                const response = fetch(`http://localhost:5000/api/user/${id}`);
                const data = response.json();
                if (!data.success)
                    setOwner("Unknown");
                setOwner(data.name);
            } catch (error) {
                console.error("Failed fetching owner: ", error);
            }
        }

        fetchOwnerInfo();
        fetchPlaylistItems();
    },[id, playlistId]);

    console.log(tracks);
    return (
        <Container>
            <div className="playlist-header mb-4 position-relative">
                <Image 
                    className="playlist-background w-100 position-absolute top-0 start-0 z-n1" 
                    src="/sea.jpg" 
                    style={{ height: "200px",opacity: "0.4" }}
                    alt="Playlist background"
                />
                <div className="playlist-info mt-5 p-5 position-relative">
                    <Row className="align-items-flex-start">
                        <Col xs="auto">
                            <Image  
                                className="mt-4"
                                src="/sea.jpg" 
                                style={{ height: "80px", width: "80px", borderRadius: "8px" }}
                                alt="Playlist Image"
                            />
                        </Col>
                        <Col className="text-start p-4">
                            <h2 >{ "Playlist Name"}</h2>
                            <p className="text-start me-2" style={{color:"black"}}>Created by <strong>{owner}</strong></p>
                        </Col>
                        <Col xs="auto" className="text-end">
                            <PencilSquare role="button" className="text-end mb-4" size={20} />
                            <div></div>
                            <PlayCircleFill size={50} className="text-end me-2" role="button" />
                        </Col>
                    </Row>
                </div>
            </div>

            <div className="playlist-tracks">
            {tracks?.map((track, index) => (
                    <Card key={track.id} className="track-card d-flex flex-row align-items-center p-2 mb-5 border-bottom">
                        <Card.Text className="text-muted me-3">#{index + 1}</Card.Text>
                        <Card.Img src={track.image || "#"} alt="Track Image" className="me-3" style={{ height: "60px", width: "60px" }} />
                        <div className="flex-grow-1">
                            <Card.Text className="fw-bold mb-0">{track.name}</Card.Text>
                            <Card.Text className="text-muted">Artist Name</Card.Text>
                        </div>
                        <PlayCircleFill size={30} className="text-success" role="button" />
                    </Card>
                ))}
                
            </div>
        </Container>
    );
}

export default PlaylistDetails;