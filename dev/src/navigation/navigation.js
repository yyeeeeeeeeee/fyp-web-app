
// import ReactDOM from "react-dom/client";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./Navbar";
import Footer from "./Footer";
import UserRoutes from "./UserRoutes";

import Home from "../pages/Home/Home";
// import Profile from "../pages/UserAccount/Profile";
import LoginPage from "../pages/auth/Login";
import Signup from "../pages/auth/SignUp";
import MusicLibrary from "../pages/Library/library";
import SearchResults from "../pages/Search/SearchResults";

import Nomatch from "../pages/Nomatch/Nomatch";

// import PostUser from "../pages/UserAccount/PostUser";
// import Dashboard from "../pages/Dashboard";
// import UpdateUser from "../pages/UpdateUser";

// import PostPlaylist from "../pages/Playlist/postPlaylist";
// import DisplayPlaylist from "../pages/Playlist/playlistDashboard";
// import UpdatePlaylist from "../pages/Playlist/updatePlaylist";
import Player from "../pages/Player/Player";

import SearchArtistAlbum from "../pages/Search/SearchArtistAlbum";

import { ToastContainer } from "react-toastify";
import { auth } from "../pages/auth/firebase";
import About from "../pages/about/About";
import PrivacyPolicy from "../pages/privacypolicy/PrivacyPolicy";
import Explore from "../pages/directory/explore";
import ArtistDetails from "../pages/directory/artistDetails";

function Nav() {
  const [user, setUser] = useState();
  const [notificationsGlobal, setNotificationsGlobal] = useState([]);
  const [allUsersGlobal, setAllUsersGlobal] = useState([]);
  const [userChatsGlobal, setUserChatsGlobal] = useState(null);
  const [markAllNotificationsAsRead, setMarkAllNotificationsAsRead] = useState(() => () => {});
  const [markNotificationAsRead, setMarkNotificationAsRead] = useState(() => () => () => {});

  useEffect(()=> {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    const userId = localStorage.getItem("userId");
    if (userId) {
      setUser({id:userId}); // Mimicking the user data for the session
    }
  },[]);

  const userId = user? user.id : localStorage.getItem("userId");

  return (
    <div className="main-routes">
    <Router>
      <NavBar 
        notifications={notificationsGlobal} 
        allUsers={allUsersGlobal} 
        userChats={userChatsGlobal} 
        markAllNotificationsAsRead={markAllNotificationsAsRead}
        markNotificationAsRead={markNotificationAsRead}
      />
      {/* <Player /> */}
      <Routes>
        {/* Default Route */}
        <Route path="/" element={user? <Navigate to={`/u/${userId}/home`}/> : <LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/about" element={<About />} />
        <Route path="/policies" element={<PrivacyPolicy />} />

        <Route path="/artist/:id" element={<ArtistDetails />} />
        {/* <Route path="/user" element={<PostUser />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user/:id" element={<UpdateUser />} />

        <Route path="/playlist" element={<PostPlaylist />} />
        <Route path="/playlist/:id" element={<UpdatePlaylist />} />
        <Route path="/playlist-dashboard" element={<DisplayPlaylist />} /> */}


        {/* User Routes with userId */}
        <Route path="/u/:id/*" 
        element={
        <UserRoutes 
          setNotificationsGlobal={setNotificationsGlobal} 
          setAllUsersGlobal={setAllUsersGlobal}
          setUserChatsGlobal={setUserChatsGlobal}
          setMarkAllNotificationsAsRead={setMarkAllNotificationsAsRead}
          setMarkNotificationAsRead={setMarkNotificationAsRead}
          />
          } 
        />

        <Route path="/search-testing" element={<SearchArtistAlbum />} />

        {/* Not Found Page */}
        <Route path="*" element={<Nomatch />} />
      </Routes>
      <ToastContainer />
      <Footer />
    </Router>
    </div>
  );
}

export default Nav;

