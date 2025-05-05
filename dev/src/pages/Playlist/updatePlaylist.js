import { useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import "./updatePlaylist.css";

function UpdatePlaylist({ userId }) {
    const location = useLocation();
    const playlist = location.state.playlist;
    const [formData, setFormData] = useState({
        name: playlist.name,
        description: playlist.description,
        _id: playlist._id,
        tracks: playlist.tracks,
    });
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");
    const [tracks, setTracks] = useState([]);

    const [selectedTracks, setSelectedTracks] = useState([]);
    const [tracksList, setTracksList] = useState([]);
    const [artists, setArtists] = useState([]);
    const [trackIds, setTrackIds] = useState([]);

    useEffect(() => {
        if (selectedTracks.length > 0) {
            const newTracks = selectedTracks.map((track) => ({
                trackId: track?.id,
                name: track?.name,
                artistId: track?.artists[0]?.id,
                albumId: track?.album?.id,
                image: track?.album?.images[0]?.url,
            }));

            const saveArtist = selectedTracks.map((track) => ({
                artistID: track?.artists[0]?.id,
                name: track?.artists[0]?.name,
            }));

            const newTrackIds = selectedTracks.map((track) => track?.id);

            setTracksList(newTracks);
            setArtists(saveArtist);
            setTrackIds(newTrackIds);
        };
    }, [selectedTracks]);

    const saveArtists = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/artists/save-artists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    artistList: artists
                }),
            })
            const data = await response.json(response);
            console.log("save new artists: ", data);

        } catch (error) {
            console.log("Failed to save new artists: ", error);
            console.error(error.message);
        }
    }

    const saveTracks = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/playlist-tracks/tracks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    tracksList: tracksList,
                })
            })
            const data = await response.json(response);
            console.log("save new tracks: ", data);

        } catch (error) {
            console.log("Failed to save new tracks: ", error);
            console.error(error.message);
        }
    }

    const connectTrackWithPlaylist = async (playlistId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/playlist-tracks/save-playlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    playlistId: playlistId,
                    trackIds: trackIds,
                })
            })
            const data = await response.json(response);
            console.log("save new tracks playlist: ", data);

        } catch (error) {
            console.log("Failed to save new control: ", error);
            console.error(error.message);
        }
    }

    const addToSelectedList = (track) => {
        setSelectedTracks((prev => [...prev, track]));
    };

    const handleSearch = async (searchInput) => {
        try {
            const response = await fetch(`http://localhost:5000/api/spotify/tracks?searchInput=${searchInput}`, {
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
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/playlist/${playlist._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                })
            })
            const data = await response.json(response);
            console.log(data);
            if (data && selectedTracks.length > 0) {
                saveArtists();
                saveTracks();
                connectTrackWithPlaylist(playlist._id);
            }
            navigate(`/u/${userId}/profile`);

        } catch (error) {
            console.log("Error: ", error);
            console.error(error.message);
        }
    }

    return (
        <div className="update-playlist-container">
            <h1>Update Playlist</h1>
            <div className="update-playlist-body">
                <div className="update-playlsit-form">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicName">
                            <Form.Label>Playlist Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter playlist name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicDesc">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                placeholder="Enter playlist's description"
                                value={formData.description || ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Button variant="dark" type="submit" className="w-100">Update</Button>
                    </Form>
                </div>
                <div className="current-tracks">
                    <div className="track-header">Current Tracks in Playlist</div>
                    <div className="current-tracks-in-list">
                        {playlist && playlist?.tracks.length > 0 ?
                            playlist?.tracks.map((track, idx) => (
                                <div className="current-track-div" key={idx}>
                                    <div className="numbering">
                                        # {idx + 1}
                                    </div>
                                    <div className="current-track-list">
                                        <p>{track?.name}</p>
                                        <p>{track?.artists?.name}</p>
                                    </div>
                                </div>
                            ))
                            : ""
                        }
                    </div>
                </div>
                <div className="add-tracks-container">
                    <div className="add-tracks-search-btn">
                        <InputGroup >
                            <FormControl
                                placeholder="Add song... "
                                type="input"
                                onKeyPress={event => {
                                    if (event.key === "Enter") { handleSearch(searchInput); }
                                }}
                                value={searchInput}
                                onChange={event => setSearchInput(event.target.value)}
                            />
                            <Button onClick={() => handleSearch(searchInput)}>
                                Search
                            </Button>
                        </InputGroup>
                    </div>
                    <div className="add-tracks-search-box">
                        <div className="add-tracks-search-list">
                            {searchInput ? (
                                <>
                                    <div className="add-tracks-div-header">
                                        <p>#</p>
                                        <p>Tracks</p>
                                    </div>
                                    {tracks && tracks.length > 0 ? (
                                        tracks.filter((track) => track !== null).map((track, idx) => (
                                            <div className="add-track-div" key={idx} onClick={() => addToSelectedList(track)}>
                                                <div className="numbering">
                                                    # {idx + 1}
                                                </div>
                                                <div className="add-tracks-list">
                                                    <p>{track?.name}</p>
                                                    <p>{track?.artists?.map((artist) => artist?.name).join(", ")}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>No results found....</div>
                                    )}
                                </>
                            ) : (
                                <div>No results searched yet....</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePlaylist;