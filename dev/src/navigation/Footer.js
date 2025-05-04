import React, { useEffect, useState } from "react";
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import "./footer.css";

function Footer() {

   const [userId, setId] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
   useEffect(() => {
      const updateLoginState = () => {
        const storedId = localStorage.getItem("userId");
        setId(storedId);
        setIsLoggedIn(!!storedId);
      };
  
      updateLoginState(); // On initial load
      window.addEventListener("userIdUpdated", updateLoginState); // Listen for updates
  
      return () => {
        window.removeEventListener("userIdUpdated", updateLoginState);
      };
    }, []);
  
  return (
    <div className="custom-nav">
      {
        isLoggedIn ?
          // User logged in
          <div>
            <Nav className="justify-content-center">
              <Nav.Item>
                <Nav.Link as={Link} to={`/u/${userId}/home`}>Home</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to={`/u/${userId}/about`}>About</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to={`/u/${userId}/policies`}>Privacy & Policy</Nav.Link>
              </Nav.Item>
            </Nav>
            <p className="text-center mt-4 mb-4">© 2025 LYY FYP</p>
            <Nav className="justify-content-end">
              <Nav.Item>
                <Nav.Link as={Link} to={`/u/${userId}/home`}>Home</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to={`/u/${userId}/about`}>About</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to={`/u/${userId}/policies`}>Privacy & Policy</Nav.Link>
              </Nav.Item>
            </Nav>
          </div> :
          //Default
          <div>
            <Nav className="justify-content-center">
              <Nav.Item>
                <Nav.Link as={Link} to="/home">Home</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/about">About</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/policies">Privacy & Policy</Nav.Link>
              </Nav.Item>
            </Nav>
            <p className="text-center mt-4 mb-4">© 2025 LYY FYP</p>
            <Nav className="justify-content-end">
              <Nav.Item>
                <Nav.Link as={Link} to="/home">Home</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/about">About</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/policies">Privacy & Policy</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
      }

    </div>
  );
}

export default Footer;