import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Container, InputGroup, FormControl, Button, Image } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { PersonFill } from 'react-bootstrap-icons';
import "./navigation.css";
import apiClient from '../spotify';
import { signOut } from "firebase/auth";
import { auth } from "../pages/auth/firebase";
import Notification from '../pages/social/notification';

function NavBar({notifications, allUsers, userChats, markAllNotificationsAsRead, markNotificationAsRead}) {
  const [id, setId] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // console.log("id from navbar: ", id);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = (searchInput) => {
    if (searchInput.trim() !== "") {
      if (id && searchInput)
        navigate(`/u/${id}/search?q=${encodeURIComponent(searchInput)}`);
      else
        navigate(`/search?q=${encodeURIComponent(searchInput)}`); // Pass search input via URL
    }
  };

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

  const handleLogout = () => {
    signOut(auth)
    .then(() => {
      console.log("User signed out successfully.");
      // Optionally clear localStorage or redirect user
      localStorage.clear();
      setId(null);
      setIsLoggedIn(false);
      window.location.href = "/home";//redirect to public homepage
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
  };

  const[image, setImage] = useState();

  useEffect(() => {
    const fetchImg = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        const img = data.image || null;

        if (img === null) {
          const res = await apiClient.get("me");
          const result = await res.json();
          setImage(result?.images[0]?.url);
        }
        setImage(img);
  
      } catch (error) {
        console.error("Error fetching user image:", error.message);
      }
    };
    if (id && isLoggedIn) fetchImg();
  },[id, isLoggedIn]);

  return (
    <Nav className="navbar" variant="underline" defaultActiveKey="home">
      <Nav.Item>
        <Image
          src="/btne_logo_clean.png"
          className='app-logo'
          alt="BTNE"
          style={{cursor:"pointer"}}
          onClick={() => {navigate(id ? `/u/${id}/home` : "/")}}
        />
      </Nav.Item>
      <div className='navbar-features'>
      <Nav.Item>
        <Nav.Link as={Link} to={id ? `/u/${id}/home` : "/"}>Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to={id ? `/u/${id}/explore` : "/explore"}>Directories</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to={id ? `/u/${id}/playlist-dashboard` : null}>Playlists</Nav.Link>
      </Nav.Item>
      {/* <NavDropdown title="Libraries" className="nav-dropdown">
        <NavDropdown.Item eventKey="4.1">Action</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.2">Another action</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.3">Something else here</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item eventKey="4.4">Separated link</NavDropdown.Item>
      </NavDropdown> */}
      </div>
      <div className='navbar-search'>
      <Nav.Item >
        <Container >
          <InputGroup >
            <FormControl
              placeholder="Search For "
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
        </Container>
      </Nav.Item>
      </div>
      <div>
        <Notification 
          userId={id} 
          notifications={notifications} 
          allUsers={allUsers} 
          userChats={userChats} 
          markAllNotificationsAsRead={markAllNotificationsAsRead}
          markNotificationAsRead={markNotificationAsRead}
        />
      </div>
      <div>
        {!isLoggedIn ? (
          <Nav.Item className='navbar-login' >
            <Nav.Link as={Link} to='/login'>
              Login
            </Nav.Link>
          </Nav.Item>
        ) : (
          <div>
            <Nav.Item>
              <NavDropdown
                align="end"
                title={<Image src={image} className='profile-img' alt='profile'/>}
                className="nav-dropdown"
                id="nav-dropdown-user"
                menuVariant="light"
                style={{ cursor: "pointer" }}
              >
                <NavDropdown.Item as={Link} to={`/u/${id}/profile`}>
                  <PersonFill /> Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  as="button"
                  onClick={handleLogout}
                  style={{
                    border: "none",
                    background: "none",
                    padding: 0,
                    color: "red",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    paddingLeft:"20px",
                  }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav.Item>
          </div>
        )}
      </div>
    </Nav>
  );
}

export default NavBar;