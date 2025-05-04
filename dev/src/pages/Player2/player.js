import React, { useEffect, useState } from 'react';
import "./player.css";
import { useLocation } from "react-router-dom";
import apiClient from "../../spotify";
import SongCard from "./SongCard";
import Queue from "./Queue";
import AudioPlayer from "./AudioPlayer";
import Widgets from './widgets';

function Player() {
    const location = useLocation();
    const [tracks, setTracks] = useState();
    const [currentTrack, setCurrentTrack] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    
    useEffect(() => {
        // const fetchData = async () => {
        //     try {
        //         const response = await fetch(`http://localhost:5000/api/spotify/album-info/${location.state?.id}`);
        //         const data = await response.json();
        //         if (!response.ok) {
        //             console.log("Album info not found");
        //         } else {
        //             setTracks(new Array(data));  // Assuming 'tracks' is the key in your response
        //             setCurrentTrack(data);
        //         }
        //     } catch (error) {
        //         console.error("Error fetching data:", error);
        //     }
        // };

        if (location.state && location.state.type === "playlist") {
            apiClient.get(`playlists/${location.state?.id}/tracks`)
                .then(res => {
                    setTracks(res.data.items);
                    setCurrentTrack(res.data.items[0].track);
                });
        } else if (location.state && location.state.type === "album") {
            //fetchData();
            apiClient.get(`albums/${location.state?.id}`)
                .then(res => {
                   setTracks(new Array(res.data)); // Assuming 'tracks' is the key in your response
                   setCurrentTrack(res.data);
                });
        } else if (location.state && location.state.type === "track") {
            //fetchData();
            apiClient.get(`tracks/${location.state?.id}`)
                .then(res => {
                   setTracks(new Array(res.data)); // Assuming 'tracks' is the key in your response
                   setCurrentTrack(res.data);
                });
        } 
        setIsLoading(false);
        

    }, [location.state]);


    useEffect(() => {
        if (tracks && tracks.length === 1) {
            setCurrentTrack(tracks[currentIndex]); //unchanged
        }
        else if (tracks && tracks.length > 0 && tracks[currentIndex]) {
            setCurrentTrack(tracks[currentIndex].track);
        }
    }, [currentIndex, tracks]);


    if (isLoading) return (<div>Loading...</div>)

    return (
        <div className="player-container">
            <div className="left-player-body">
                {Array.isArray(tracks) && tracks.length > 0 ? (
                    <AudioPlayer
                        currentTrack={currentTrack}
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                        total={tracks}
                    />
                ) : (
                    <div>Loading audio...</div>
                )}
                <Widgets artistID={currentTrack?.album?.artists?.[0]?.id || currentTrack?.artists?.[0]?.id} />
            </div>
            <div className="right-player-body">
                {currentTrack && (
                <SongCard album={currentTrack?.album || currentTrack} />
                )}
                <Queue tracks={tracks} setCurrentIndex={setCurrentIndex} />
            </div>
        </div>
    )
}

export default Player;