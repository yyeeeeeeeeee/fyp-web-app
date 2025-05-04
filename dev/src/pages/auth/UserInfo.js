import { Container, Form, Card, ListGroup, Button, Col, Row, Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { PencilSquare, CheckCircle, XCircle } from 'react-bootstrap-icons';
import { useNavigate } from "react-router-dom";

import PlaylistDashboard from "../Playlist/playlistDashboard";

import { auth, AuthDB } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import {toast} from "react-toastify";


function UserInfo({ userId }) {  // ✅ Accept `userId` as a prop
    const [editingField, setEditingField] = useState('');
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [tempData, setTempData] = useState({ ...formData });

    // MongoDb 
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user/${userId}`);  // ✅ Use `userId`
                const data = await response.json();
                setFormData({
                    username: data.username || "", // Ensure non-undefined default
                    email: data.email || "",
                    password: data.password || ""
                });
            } catch (error) {
                console.error("Error fetching user:", error.message);
            }
        };
        if (userId) fetchUser();  // ✅ Only fetch if `userId` is valid
    }, [userId]);  // ✅ Dependency is `userId`, not `id`

    const handleEdit = (field) => {
        setEditingField(field);
        setTempData({ ...formData }); // Store current data as temp backup
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = () => {
        setFormData({ ...tempData });
        setEditingField('');
    };

    const handleCancel = () => {
        setEditingField('');
        setTempData({ ...formData }); // Revert changes
    };

    const navigate = useNavigate();
  // firebase Auth
  const [userDetails, setUserDetails] = useState(null);
  const fetchUserData = async() => {
    auth.onAuthStateChanged(async(user) => {
      console.log(user);
      const docRef = doc(AuthDB, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("User is not logged in");
      }
    });
  };

  useEffect(()=> {
    fetchUserData();
  },[]);

  async function handleLogout() {
    try {
      await auth.signOut();
      navigate("/login");
      console.log("User logged out Successfully");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

    return (
        <Container fluid className="d-flex justify-content-center" style={{ padding: "0" }}>
    {/* Main Container for Banner + Info */}
    <Container style={{ width: "95%", padding: "0" }}>
        {/* Background Image */}
        <div style={{ position: "relative", height: "300px", overflow: "hidden", minWidth: "600px" }}>
            <Image
                src="/sea.jpg"  // Updated path
                fluid
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                }}
                alt="Background Image"
            />

            {/* Overlay User Info Section */}
            <Container
                style={{
                    position: "absolute",
                    bottom: "30px",  // Slight overlap with banner
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80%",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "10px",
                    padding: "15px",
                    zIndex: 2,
                    textAlign: "center",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
                }}
            >
                <Row className="align-items-start">
                    <Col xs="auto">
                        <Image
                            src="/sea.jpg"
                            rounded
                            style={{ backgroundColor: "pink", width: "80px", height: "80px", objectFit: "cover" }}
                            alt="User Image"
                        />
                    </Col>
                    <Col style={{ textAlign: "left", paddingTop: "15px"}}>
                        <h5>{formData.username}</h5>
                    </Col>
                    <Col>
                    <Button className='btn btn-primary' onClick={handleLogout}>Logout</Button>
                    </Col>
                </Row>
            </Container>
        </div>

        <Container>
            <PlaylistDashboard />
            <Card>
                <div>
                <p>Following</p>
            </div>
            </Card>
            <Card>
                <div>
                <p>Favourites</p>
            </div>
            </Card>
        </Container>
    </Container>
    <style>
                {`
                .p {
                    color: black,
                }
                    `}
                    </style>

</Container>

    );
}

export default UserInfo;
