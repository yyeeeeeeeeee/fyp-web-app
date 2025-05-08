import './App.css';
import React, {useEffect, useState} from "react";
import Navigation from './navigation/navigation';
// import MusicPlayer from './pages/Player';
import Login from './spotify/login';
import { loginEndpoint, setClientToken } from './spotify';

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");
    const expiresIn = urlParams.get("expires_in");


    // clear params from URL
    if (accessToken) {
      window.history.replaceState({}, document.title, "/home");

      window.localStorage.setItem("token", accessToken);
      window.localStorage.setItem("refreshToken", refreshToken);
      window.localStorage.setItem("expiresIn", expiresIn);

      setToken(accessToken);
      setClientToken(accessToken);

     // Set timeout to refresh token before it expires
    setTimeout(async () => {
      const storedRefreshToken = window.localStorage.getItem("refreshToken");
      if (storedRefreshToken) {
        try {
          const response = await fetch(
            `https://fyp-web-app-sgso.onrender.com/auth/refresh_token?refresh_token=${storedRefreshToken}`
          );
          const data = await response.json();
          console.log("refresh: ", data);

          if (data.access_token) {
            setToken(data.access_token);
            setClientToken(data.access_token);

            // Store the new access token
            window.localStorage.setItem("token", data.access_token);
            window.localStorage.setItem("expiresIn", data.expires_in);
          } else {
            console.error("No access_token in response");
            window.location.href = loginEndpoint;  // Redirect to login if refresh fails
          }
        } catch (err) {
          console.error("Error refreshing token", err);
          window.location.href = loginEndpoint;  // Redirect to login on error
        }
      }
    }, parseInt(expiresIn) * 1000); // Set timeout based on expires_in

    } else {
      const token = window.localStorage.getItem("token");
      if (token) {
        setToken(token);
        setClientToken(token);
      }
    }
  }, []);

  return (
    !token? <Login /> :
      <div className='App'>
          <Navigation />
          
      </div>
  );
}

export default App;

