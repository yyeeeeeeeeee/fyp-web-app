import { Routes, Route, useParams, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import UserProfile from "../pages/auth/Profile";
import SearchResults from "../pages/Search/SearchResults";

import PostUser from "../pages/auth/PostUser";
import Dashboard from "../pages/Dashboard";
import UpdateUser from "../pages/UpdateUser";

import PostPlaylist from "../pages/Playlist/postPlaylist";
import DisplayPlaylist from "../pages/Playlist/playlistDashboard";
import UpdatePlaylist from "../pages/Playlist/updatePlaylist";
import PlaylistDetail from "../pages/Playlist/playlistDetails";

import About from "../pages/about/About";
import PrivacyPolicy from "../pages/privacypolicy/PrivacyPolicy";
import Explore from "../pages/directory/explore";
import Social from "../pages/social/chatDashboard";
import AlbumDetails from "../pages/AlbumDetails";

import Player2 from "../pages/Player2/player";
import Player from "../pages/Player";
import Library from "../pages/Library/library";
import ArtistDetails from "../pages/directory/artistDetails";
import { useState } from "react";

function UserRoutes({setNotificationsGlobal, setAllUsersGlobal, 
  setUserChatsGlobal, setMarkAllNotificationsAsRead, setMarkNotificationAsRead}) {
  const { id: userIdFromUrl } = useParams();
  const userId = userIdFromUrl || localStorage.getItem('userId');
  //const { id: userId } = useParams() || localStorage.getItem('userId'); // Get userId from URL
  // console.log("User ID from URL:", userId); // Debugging

  if (!userId || userId === "undefined") {
    return <Navigate to="/home" replace />;
  }
  
  return (
    <Routes>
      <Route path="home" element={<Home userId={userId} />} />
      <Route path="about" element={<About userId={userId} />} />
      <Route path="policies" element={<PrivacyPolicy userId={userId} />} />
      <Route path="explore" element={<Explore userId={userId} />} />
      <Route path="social" 
        element={
        <Social userId={userId} 
        setNotificationsGlobal={setNotificationsGlobal} 
        setAllUsersGlobal={setAllUsersGlobal}
        setUserChatsGlobal={setUserChatsGlobal}
        setMarkAllNotificationsAsRead={setMarkAllNotificationsAsRead}
        setMarkNotificationAsRead={setMarkNotificationAsRead}
        />
      }/>
      <Route path="profile" element={<UserProfile userId={userId} />} />
      <Route path="search" element={<SearchResults userId={userId}/>} />
      {/* <Route path="player" element={<Player userId={userId}/>} /> */}

      <Route path="artist/:id" element={<ArtistDetails userId={userId}/>} />

      <Route path="player/*" element={<Player2 userId={userId}/>} />

      <Route path="album-detail/:albumId" element={<AlbumDetails userId={userId} /> } />

      <Route path="user" element={<PostUser userId={userId} />} />
      <Route path="dashboard" element={<Dashboard userId={userId} />} />
      <Route path="user/:id" element={<UpdateUser userId={userId} />} />
      <Route path="library" element={<Library userId={userId} />} />
      <Route path="library/:id" element={<Library userId={userId} />} />

      <Route path="playlist" element={<PostPlaylist userId={userId} />} />
      <Route path="playlist/:id" element={<UpdatePlaylist userId={userId} />} />
      <Route path="playlist-dashboard" element={<DisplayPlaylist userId={userId} />} />
      <Route path="playlist/:id/playlist-details" element={<PlaylistDetail userId={userId} />} />
    </Routes>
  );
}

export default UserRoutes;
