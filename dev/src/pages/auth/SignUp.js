import { Container, InputGroup, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, AuthDB } from "./firebase";
import { toast } from 'react-toastify';
import { setDoc, doc } from "firebase/firestore";
import "./sigup.css";

function SignUp() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        terms: false,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.password = "Username must be at least 3 characters";
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email must be a valid email format";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (!formData.confirm_password) {
            newErrors.confirm_password = "Please confirm your password";
        } else if (formData.confirm_password.length < 8) {
            newErrors.confirm_password = "Password must be at least 8 characters";
        } else if (formData.password !== formData.confirm_password) {
            newErrors.password = 'Passwords must be MATCHED.';
            newErrors.confirm_password = 'Passwords must be MATCHED.';
        }

        if (!formData.terms) {
            newErrors.terms = "Terms must be accepted";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const user = auth.currentUser;
                console.log(user);
                console.log("User created successfully");
                if (user) {
                    await setDoc(doc(AuthDB, "Users", user.uid), {
                        username: formData.username,
                        email: user.email,
                        createAt: new Date(),
                    });
                }
                toast.success("User Registered Successfully!!", {
                    position: "top-center",
                });
                await handleRegisterDB(user, formData);
            } catch (error) {
                console.error(error.message);
                setErrors({ general: error.message });
                toast.success(error.message, {
                    position: "bottom-center",
                });
            }
        }
    };

    const handleRegisterDB = async (user, data) => {
        try {
            const response = await fetch("https://fyp-web-app-sgso.onrender.com/api/u/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firebaseUid: user.uid,
                    username: data.username,
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                navigate("/login");
            } else {
                setErrors({ general: result.error });
                console.error("Failed to register user")
            }
        } catch (error) {
            setErrors({ general: error.message });
            console.error("Failed to Fetch API")
        }
    };

    return (
        <div className="signup-page">
        <Container className="signup-container">
            <Card className="signup-card">
                <Card.Header>Register New Account</Card.Header>
                <Form noValidate onSubmit={handleSubmit} className="signup-form">
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <InputGroup hasValidation>
                            <InputGroup.Text>@</InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                isInvalid={!!errors.username}
                            />
                            <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                            />
                            <Button variant="outline-secondary" onClick={()=> setShowPassword(!showPassword)}>
                                {showPassword? <EyeSlash />: <Eye />}
                            </Button>
                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="confirm_password">
                        <Form.Label>Confirm Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                isInvalid={!!errors.confirm_password}
                            />
                            <Button variant="outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <EyeSlash /> : <Eye />}
                            </Button>
                            <Form.Control.Feedback type="invalid">{errors.confirm_password}</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Row>
                            <Col>
                                <Form.Check
                                    required
                                    name="terms"
                                    label="Agree to terms and conditions"
                                    onChange={handleChange}
                                    checked={formData.terms}
                                    isInvalid={!!errors.terms}
                                    feedback={errors.terms}
                                    feedbackType="invalid"
                                />
                            </Col>
                            <Col style={{ textAlign: "end" }}>
                                <Form.Label>
                                    Already have an account?
                                    <Form.Label as={Link} to="/login"> Login </Form.Label>
                                </Form.Label>
                            </Col>
                        </Row>
                    </Form.Group>

                    {errors.general && (
                        <div className="text-danger mb-3">
                            {errors.general}
                        </div>
                    )}

                    <Button className="signup-btn" type="submit">Register</Button>
                </Form>
            </Card>
        </Container>
        </div>
    );
}

export default SignUp;
