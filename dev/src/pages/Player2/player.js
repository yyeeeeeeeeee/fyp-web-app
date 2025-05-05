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

    const ownPlaylist = location?.state?.playlist || null;

    useEffect(() => {
        const fetchData = async () => {
            if (!location.state) return;
    
            const type = location.state.type;
            const id = location.state.playId;
            const typeHandlers = {
                playlist: async () => {
                    const res = await apiClient.get(`playlists/${id}/tracks`);
                    setTracks(res.data.items);
                    setCurrentTrack(res.data.items[0].track);
                },
                album: async () => {
                    const res = await apiClient.get(`albums/${id}`);
                    setTracks([res.data]);
                    setCurrentTrack(res.data);
                },
                track: async () => {
                    const res = await apiClient.get(`tracks/${id}`);
                    setTracks([res.data]);
                    setCurrentTrack(res.data);
                },
                own: () => {
                    setTracks(ownPlaylist.tracks);
                    setCurrentTrack(ownPlaylist.tracks[0]);
                }
            };
    
            try {
                await typeHandlers[type]?.();
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchData();
    }, [location.state]);


    useEffect(() => {
        if (tracks && tracks.length === 1) {
            setCurrentTrack(tracks[currentIndex]); //unchanged
        }
        else if (tracks && tracks.length > 0 && location.state.type === "own") {
            setCurrentTrack(tracks[currentIndex]);
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
                <Widgets artistID={
                    currentTrack?.album?.artists?.[0]?.id || 
                    currentTrack?.artists?.[0]?.id || 
                    currentTrack?.artists?.artistID
                    } 
                />
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