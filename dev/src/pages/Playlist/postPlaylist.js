import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./postPlaylist.css";
import { useNavigate, useParams } from "react-router-dom";

function PostPlaylist() {
    const [formData, setFormData] = useState({
        userId: "",
        name: "",
        description: "",
    });
    const navigate = useNavigate();
    const {id} = useParams();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            userId: id, //store
            [name]: value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/playlist`, {
                method: "POST",
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

    return (
        <>
            <div className="center-form">
                <h1>Post Playlist Component</h1>
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

                    <Button variant="dark" type="submit" className="w-100">Post Playlist</Button>
                </Form>
            </div>
        </>
    )
};

export default PostPlaylist;