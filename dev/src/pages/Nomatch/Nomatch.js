import React from 'react';
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

function NotFoundPage() {
    return (
        <Container className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
            <h1 className="display-1 fw-bold" style={{ color: "black", backgroundColor: "white", padding: "10px 20px", borderRadius: "10px" }}>404</h1>
            <h2 className="fs-3 text-dark">Oops! Page Not Found</h2>
            <p className="text-muted">The page you are looking for doesn’t exist.</p>
            <Link to="/">
                <Button variant="primary" className="mt-3 px-4 py-2">Go Back Home</Button>
            </Link>
        </Container>
    );
}

export default NotFoundPage;
