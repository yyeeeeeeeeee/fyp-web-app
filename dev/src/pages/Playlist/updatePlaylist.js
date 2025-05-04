import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import "./updatePlaylist.css";

function UpdatePlaylist() {
    const {id} = useParams(); //save user id
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
            const fetchPlaylist = async() => {
                try {
                    const response = await fetch(`http://localhost:5000/api/playlist/${id}`);
                    const data = await response.json();
                    setFormData(data);
                } catch (error) {
                    console.error("error while fetching playlists:", error.message);
                }
            }
            fetchPlaylist();
        },[id]);

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/playlist/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json(response);
            console.log(data);
            navigate(`/u/${id}/playlist-dashboard`);

        } catch (error) {
            console.error(error.message);
        }   
    }

    return(
        <>
        <div className="center-form">
            <h1>Update Playlist Component</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Playlist Name</Form.Label>
                    <Form.Control 
                    type="text"
                    name="name"
                    placeholder="Enter playlist name"
                    value={formData.playlist_name}
                    onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicDesc">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                    type="text"
                    name="description"
                    placeholder="Enter playlist's description"
                    defaultValue=""
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    />
                </Form.Group>

                <Button variant="dark" type="submit" className="w-100">Update Playlist</Button>
            </Form>
        </div>
        </>
    )
};

export default UpdatePlaylist;