import React, {useState} from "react";
import { Form, Button } from "react-bootstrap";
import "./postUser.css";
import { useNavigate } from "react-router-dom";

function PostUser() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const navigate = useNavigate();

    const handleIUnputChange = (event) => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://fyp-web-app-sgso.onrender.com/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json(response);
            console.log(data);
            navigate("/dashboard");

        } catch (error) {
            console.error(error.message);
        }   
    }
    
    return(
        <>
        <div className="center-form">
            <h1>Post User Component</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={handleIUnputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                    type="text"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleIUnputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control 
                    type="text"
                    name="phone"
                    placeholder="Enter phone"
                    value={formData.phone}
                    onChange={handleIUnputChange}
                    />
                </Form.Group>

                <Button variant="dark" type="submit" className="w-100">Post</Button>
            </Form>
        </div>
        </>
    )
};

export default PostUser;
