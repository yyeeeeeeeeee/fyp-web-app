import { useEffect, useState } from "react";
import { Card, Container, Image, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { PencilSquare, PlayCircleFill, PlusSquare, Share } from "react-bootstrap-icons";

function AlbumDetails() {
    const [loading, setLoading] = useState(true);  // Add loading state
    const {id, albumId} = useParams();
    const [tracks,setTracks] = useState([]);
    const [albumInfo, setAlbumInfo] = useState(null);

    const fetchAlbumInfo = async() => {
        try {
            const response = await fetch(`http://localhost:5000/api/spotify/album-info/${albumId}`);
            const data = await response.json();
            if (!data.success) console.log("Info not found");
            setAlbumInfo(data);
        } catch (error) {
            console.error("Failed fetching this album: ", error);
        } finally {
            setLoading(false);  // Mark loading as complete
        }
    }

    const fetchAlbumItems = async() => {
        try {
            const response = await fetch(`http://localhost:5000/api/spotify/album-tracks/${albumId}`);
            const data = await response.json();
            console.log(data);
            if (!data.success)
                console.log("Tracks no found in this album");
            setTracks(data);
        } catch (error) {
            console.error("Failed fetching tracks of this album: ", error);
        }
    }

    useEffect(()=> {
        const fetchData = async () => {
            await Promise.all([fetchAlbumInfo(), fetchAlbumItems()]);
        };
        setLoading(true);  // Reset loading state on new request
        fetchData();
    },[id, albumId]);

    if (loading) return <p>Loading...</p>;  // Display loading indicator

    const handlePlay = async (uri) => {
        try {
            const response = await fetch(`http://localhost:5000/play?uri=${uri}`);
            const data = await response.text();
            console.log(data);
            if (!data.success)
                console.log("Tracks no found in this album");
        } catch (error) {
            console.error("Failed fetching tracks of this album: ", error);
        }
    }

    return (
        <Container>
            <div className="playlist-header mb-4 position-relative">
                <Image 
                    className="playlist-background w-100 position-absolute top-0 start-0 z-n1" 
                    src="/sea.jpg" 
                    style={{ height: "200px",opacity: "0.4" }}
                    alt="Playlist background"
                />
                <div className="playlist-info mt-5 p-5 pb-0 position-relative">
                    <Row className="align-items-flex-start">
                        <Col xs="auto">
                            <Image  
                                className="mt-4"
                                src={albumInfo.images[0].url}
                                style={{ height: "80px", width: "80px", borderRadius: "8px" }}
                                alt="Album Image"
                            />
                        </Col>
                        <Col className="text-start p-4">
                            <h2>{albumInfo.name}</h2>
                            <p style={{color: "black"}}>Total of songs: {albumInfo.total_tracks}</p>
                            <p>Release on {albumInfo.release_date}</p>
                            <p>{albumInfo.artists.map((artist) => artist.name).join(", ")}</p>
                        </Col>
                        <Col xs="auto" className="text-end">
                            <PencilSquare role="button" className="text-end mb-4" size={20} />
                            <div></div>
                            <PlayCircleFill size={50} className="text-end me-2" role="button" />
                        </Col>
                    </Row>
                </div>
            </div>

            <div className="playlist-tracks mb-5">
            {tracks.map((track, index) => (
                    <Card key={track.id} onClick={handlePlay(track.uri)} className="track-card d-flex flex-row align-items-center p-2 border-bottom">
                        <Card.Text className="text-muted me-3">{index + 1}.</Card.Text>
                        <div className="flex-grow-1">
                            <Card.Text className="fw-bold mb-0" style={{color:"black"}}>{track.name}</Card.Text>
                            <Card.Text className="text-muted">
                                {track.artists.map((artist) => artist.name).join(", ")}
                            </Card.Text>
                        </div>
                        <PlayCircleFill size={30} className="text-success" role="button" />
                    </Card>
                ))}
            </div>
        </Container>
    );
}

export default AlbumDetails;