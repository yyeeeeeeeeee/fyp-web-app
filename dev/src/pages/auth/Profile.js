import { Container, Image, Col, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup } from 'reactstrap';

import Library from '../Library/library';
import PlaylistDashboard from "../Playlist/playlistDashboard";
import { auth, AuthDB } from "./firebase";
import { deleteUser } from 'firebase/auth';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./profile.css";
import { Trash } from 'react-bootstrap-icons';

function UserProfile({ userId }) {
  const  id  = userId || localStorage.getItem("userId");
  const [editingField, setEditingField] = useState('');
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    image: "", //http://localhost:5000${user.imageUrl}
  });
  const [tempData, setTempData] = useState({ ...formData });
  const [toggleUpdateModal, setToggleUpdateModal] = useState(false);
  const toggleModal = () => { setToggleUpdateModal(prev => !prev) };
  const [selectedFile, setSelectedFile] = useState(null);

  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();


  // MongoDb 
  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });  // ✅ Use `userId`
      const data = await response.json();
      setFormData({
        username: data.username || "", // Ensure non-undefined default
        email: data.email || "",
        image: data.image || ""
      });
    } catch (error) {
      console.error("Error fetching user:", error.message);
    }
  };


  // firebase Auth
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      //console.log("Auth state changed:",user);
      if (!user) {
        console.log("User is not logged in");
        setUserDetails(null);
        return; // Exit early to prevent error
      }
      try {
        const docRef = doc(AuthDB, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          //console.log("Firestore user data:", docSnap.data());
        } else {
          console.log("No such user document!");
        }
      } catch (error) {
        console.error("Error fetching Firestore data:", error.message);
      }
    });
  };

  useEffect(() => {
    if (id) fetchUser();  // Only fetch if `userId` is valid
    fetchUserData();
  }, [id]);  // Dependency is `userId`, not `id`


  const updateInfo = (file, userData) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Str = reader.result.split(',')[1];
      const contentType = file.type;
      try {
        const res = await fetch(`http://localhost:5000/api/user/${userData._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: userData._id,
            username: userData.username,
            email: userData.email,
            image: base64Str,
            contentType: contentType
          })
        });
        const data = await res.json();
        console.log("Updated response: ", data);

        if (data) {
          updateAuthData(base64Str);
          console.log("Firebase auth updated successfully");
          window.location.reload();
        }

      } catch (error) {
        console.error("Updated failed: ", error);
      }
    };
    reader.readAsDataURL(file);
  }

  const updateAuthData = async (base64Str) => {
    auth.onAuthStateChanged(async (user) => {
      try {
        const userDocRef = doc(AuthDB, "Users", user.uid);
        await updateDoc(userDocRef, {
          username: formData.username,
          email: formData.email,
          image: base64Str || formData.image, // Save base64 or image URL
        });
      } catch (error) {
        console.error("Error fetching Firestore data:", error.message);
      }
    });
  };

  const handleDeleteAcc = async () => {
    try {
      // Step 1: Soft delete in MongoDB (backend API call)
      await fetch(`http://localhost:5000/api/user/delete/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDeleted: true }), // or whatever soft delete logic you use
      });

      // Step 2: Delete from Firebase Auth
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
      }

      alert("Account deleted successfully.");
      localStorage.clear();
      window.location.href = "/"; // redirect or logout
    } catch (error) {
      console.error("Failed to delete account:", error.message);
      if (error.code === 'auth/requires-recent-login') {
        alert("Please re-authenticate to delete your account.");
      }
    }
  };

  return (
    <Container fluid className="profile-main-container">
      <Row className="profile-main-container-body">
        {/* Full Width Content */}
        <Col className="profile-main-body">
          <Container fluid className="d-flex justify-content-center" style={{ padding: "0" }}>
            {/* Main Container for Banner + Info */}
            <Container style={{ width: "95%", padding: "0" }}>
              {/* Background Image */}
              <div className='profile-body'>
                <div className='profile-background'>
                  <div className='profile-delete-btn' onClick={() => handleDeleteAcc()}>
                    <Trash size={25} />
                  </div>
                </div>
                {/* Overlay User Info Section */}
                <Container className='profile-info-container'>
                  <Row className="align-items-start">
                    <Col xs="auto">
                      <div style={{ width: "80px", height: "80px" }}>
                        <Image
                          src={formData.image || null}
                          rounded
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          alt="User Image"
                        />
                      </div>
                    </Col>
                    <Col style={{ textAlign: "left", paddingTop: "15px" }}>
                      <h5>{formData.username}</h5>
                    </Col>
                    <Col>
                      <Button className='edit-btn' onClick={() => toggleModal()}>Edit Info</Button>
                    </Col>
                  </Row>
                </Container>
              </div>

              <Container>
                {/* <PlaylistDashboard /> */}
                <br></br>
                <h3>Playlists</h3>
                <Library />
              </Container>
              <Container>
                <h3>Saved Collections</h3>
                <PlaylistDashboard userId={id} />
              </Container>
            </Container>
          </Container>
        </Col>
      </Row>

      <Modal className="update-modal" isOpen={toggleUpdateModal} toggle={toggleModal}>
        <ModalHeader className="update-modal-header" toggle={toggleModal}>Edit Info</ModalHeader>
        <ModalBody className="update-modal-body">
          <FormGroup className="update-modal-formgroup">
            <label>Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup className="update-modal-formgroup">
            <label>Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup className="update-modal-formgroup">
            <label>Upload Profile Image</label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter className='update-modal-footer'>
          <Button
            className='update-modal-btn'
            onClick={() => {
              if (selectedFile) {
                updateInfo(selectedFile, { _id: id, username: formData.username, email: formData.email });
              }
              toggleModal();
            }}
          >
            Update
          </Button>
          <Button className='update-modal-btn' onClick={() => toggleModal()}>Cancel</Button>
        </ModalFooter>
      </Modal>

    </Container>
  );
}

export default UserProfile;

// function UserProfile() {
//   const { id } = useParams();
//   const [activeComponent, setActiveComponent] = useState(null);

//   //const [activeComponent, setActiveComponent] = useState("info");

//   return (
//     <Container fluid className="p-0 m-0">
//       <Row className="p-0 m-0" style={{ backgroundColor: "rgba(212, 222, 234, 0.6)"}}>
//         {/* Side Menu */}
//         <Col md={3} className="bg-dark text-white vh-100 p-5" style={{ minWidth: "215px", maxWidth: "300px"}}>
//           <h4 className="mb-4 text-center">Dashboard</h4>
//           <Nav className="flex-column">
//             <Nav.Link
//               onClick={() => setActiveComponent("info")}
//               className={`mb-3 ${activeComponent === "info" ? "text-primary fw-bold" : "text-white"}`}
//             >
//               <InfoCircle size={20} className="me-2" /> Profile
//             </Nav.Link>
//             <Nav.Link
//               onClick={() => setActiveComponent("setting")}
//               className={`mb-3 ${activeComponent === "setting" ? "text-primary fw-bold" : "text-white"}`}
//             >
//               <Gear size={20} className="me-2" /> Setting
//             </Nav.Link>
//             <Nav.Link
//               onClick={() => setActiveComponent("history")}
//               className={`mb-3 ${activeComponent === "history" ? "text-primary fw-bold" : "text-white"}`}
//             >
//               <ClockHistory size={20} className="me-2" /> History
//             </Nav.Link>
//           </Nav>
//         </Col>

//         {/* Main Content Area */}
//         <Col md={9} className="p-0" style={{ backgroundColor: "#f8f9fa" }}>
//           <Container className="m-0" style={{ backgroundColor: "rgba(212, 222, 234, 0.6)", height: "100vh" }}>
//             {activeComponent === "info" && <UserInfoComponent userId={id} />}
//             {activeComponent === "setting" && <SettingComponent userId={id}/>}
//             {activeComponent === "history" && <PostUser />}
//           </Container>
//         </Col>
//       </Row>
//     </Container>
//   );
// }