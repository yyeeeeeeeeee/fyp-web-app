import { Container, InputGroup, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { toast } from 'react-toastify';

function Login() {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        terms: false,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email must be a valid format";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (!formData.terms) {
            newErrors.terms = "Terms must be accepted";
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                const uid = userCredential.user.uid;
                console.log("User logged in successfully");
                toast.success("User Logged in Successfully!!", {
                    position: "top-center",
                });

                await handleLoginDB(uid, formData);
                
            } catch (error) {
                console.error(error.message);
                setErrors({ general: error.message });
                toast.error(error.message, {
                    position: "bottom-center",
                });
            }
        }
    };

    const handleLoginDB = async (uid, data) => {
        try {
            const response = await fetch("https://fyp-web-app-sgso.onrender.com/api/u/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    firebaseUid: uid,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('userId', result.id);
                window.dispatchEvent(new Event("userIdUpdated"));
                navigate(`/u/${result.id}/profile`);
            } else {
                setErrors({ general: result.error || "Login failed" });
            }
        } catch (error) {
            setErrors({ general: error.message });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='login-page'>
            <Container className="login-container" >
                <Card className="login-card" >
                    <Card.Header className="login-header">Login</Card.Header>
                    <Form className="login-form" noValidate onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className="form-label">Email address</Form.Label>
                            <Form.Control
                                className="form-control"
                                name="email"
                                type="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label className="form-label">Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    className="form-control"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password}
                                />
                                <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeSlash /> : <Eye />}
                                </Button>
                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Row>
                                <Col>
                                    <Form.Check
                                        type="checkbox"
                                        name="terms"
                                        label="Agree to terms"
                                        checked={formData.terms}
                                        onChange={handleChange}
                                        isInvalid={!!errors.terms}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.terms}</Form.Control.Feedback>
                                </Col>
                                <Col className="text-end">
                                    <Form.Label className="form-label">
                                        Don't have an account?
                                        <Form.Label className="form-label" as={Link} to="/signup"> Sign Up </Form.Label>
                                    </Form.Label>
                                </Col>
                            </Row>
                        </Form.Group>

                        {errors.general && <p className="error-message">{errors.general}</p>}

                        <div>
                            <Button
                                className='login-btn'
                                variant="primary"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Logging in..." : "Submit"}

                            </Button>
                        </div>

                    </Form>
                </Card>
            </Container>
        </div>
    );
}

export default Login;
