import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import "./UpdateUser.css";

function UpdateUser() {
    const {id} = useParams(); //save user id
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
            const fetchUser = async() => {
                try {
                    const response = await fetch(`http://localhost:5000/api/user/${id}`);
                    const data = await response.json();
                    setFormData(data);
                } catch (error) {
                    console.error("error while fetching users:", error.message);
                }
            }
            fetchUser();
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
            const response = await fetch(`http://localhost:5000/api/user/${id}`, {
                method: "PATCH",
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
            <h1>Update User Component</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                    type="text"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                    type="text"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                    />
                </Form.Group>

                <Button variant="dark" type="submit" className="w-100">Update User</Button>
            </Form>
        </div>
        </>
    )
};

export default UpdateUser;