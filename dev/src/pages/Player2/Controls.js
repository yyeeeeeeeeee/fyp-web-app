import React from "react";
import "./controls.css";
import { IconContext } from "react-icons";
import {FaPause} from "react-icons/fa";
import {IoPlay, IoPlaySkipBack, IoPlaySkipForward, IoRepeat, IoShuffleOutline} from "react-icons/io5";

function Controls( { isPlaying, setIsPlaying, handleNext, handlePrev, total }) {

    const handleShuffle = () => {}

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    }

    const handleRepeat = () => {}


    return (
        <IconContext.Provider value={{size: "35px", color: "#C4D0E3"}}>
            <div className="controls-wrapper">
                <div className="action-btn" onClick={handleShuffle}>
                    <IoShuffleOutline />
                </div>
                <div className="action-btn" onClick={handlePrev}>
                    <IoPlaySkipBack />
                </div>
                <div className={isPlaying ? "play-pause-btn active" : "play-pause-btn"} onClick={handlePlayPause}>
                    {isPlaying? <FaPause/> : <IoPlay/>}
                </div>
                <div className="action-btn" onClick={handleNext}>
                    <IoPlaySkipForward />
                </div>
                <div className="action-btn" onClick={handleRepeat}>
                    <IoRepeat />
                </div>
            </div>
        </IconContext.Provider>
    );
}

export default Controls;