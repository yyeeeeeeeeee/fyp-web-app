import React, { useEffect, useState } from "react";
import "./audioplayer.css";
import ProgressCircle from "./ProgressCircle";
import WaveAnimation from "./WaveAnimation";
import Controls from "./Controls";
import { useRef } from "react";

function AudioPlayer({ currentTrack, currentIndex, setCurrentIndex, total }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackProgress, setTrackProgress] = useState(0);
    const intervalRef = useRef();
    const isReady = useRef(false);
    

    // var audioSrc = total[currentIndex]?.track.preview_url;
    const audioRef = useRef(new Audio()); // Initialize audioRef as a new Audio object
    var songSrc = total[currentIndex]?.track?.name || total[currentIndex]?.name;
    const [audioSrc, setAudioSrc] = useState('');
    // const audioRef = useRef(new Audio(total[0]?.track?.preview_url)); //change way to get preview url

    const { duration } = audioRef.current?.duration || 0;
    const currentPercentage = duration ? (trackProgress / duration) * 100 : 0;

    // fetching preview url
    const fetchPreviewURL = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/song/preview?songname=${encodeURIComponent(songSrc)}`);  // Use `userId
            const data = await response.json();
            if (!response.ok) {
                console.log("Error fetching new releases data");
                return null;
            }
            if (data) {
                setAudioSrc(data.results[0].previewUrls[0]);
            }

        } catch (err) {
            console.error("Error fetching audio preview url:", err.message);
            return null;
        }
    };

    useEffect(() => {
        fetchPreviewURL(songSrc);  // Fetch preview URL
        if (audioRef.current) {
            audioRef.current.src = audioSrc;  // Set the src to the audio file URL
            audioRef.current.load();  // Reload the audio to reflect the new source
        } else {
            // Ensure audioRef.current is not null before setting the src
            audioRef.current = new Audio(audioSrc);
            audioRef.current.load();
        }
    }, [songSrc, audioSrc]);  // Dependencies to trigger the effect when songSrc or audioSrc changes
    
    
    const startTimer = () => {
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (audioRef.current.ended) {
                handleNext();
            } else {
                setTrackProgress(audioRef.current.currentTime);
            }
        }, [1000]);
    };

    useEffect(() => {
        if (audioRef.current && audioRef.current.src) {
            if (isPlaying) {
                audioRef.current.play();
                startTimer();
            } else {
                clearInterval(intervalRef.current);
                audioRef.current.pause();
            }
        } else {
            if (isPlaying) {
                audioRef.current = new Audio(audioSrc);
                audioRef.current.play();
                startTimer();
            } else {
                clearInterval(intervalRef.current);
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        audioRef.current.pause();
        audioRef.current = new Audio(audioSrc);

        setTrackProgress(audioRef.current.currentTime);

        isReady.current = true;
        // if (isReady.current) {
        //     audioRef.current.play();
        //     setIsPlaying(true);
        //     startTimer();
        // } else {
        //     isReady.current = true;
        // }
    }, [currentIndex]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleNext = () => {
        if (currentIndex < total.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else setCurrentIndex(0);
    };

    const handlePrev = () => {
        if (currentIndex - 1 < 0) setCurrentIndex(total.length - 1);
        else setCurrentIndex(currentIndex - 1);
    };

    const addZero = (n) => {
        return n > 9 ? "" + n : "0" + n;
    };

    const artists = [];
    currentTrack?.album?.artists.forEach((artist) => {
        artists.push(artist.name);
    });
    if (artists === null) {
        currentTrack?.artists.forEach((artist) => {
        artists.push(artist.name);
    });
    }

    return (
        <div className="player-body flex">
            <div className="player-left-body">
                <ProgressCircle
                    percentage={currentPercentage}
                    isPlaying={true}
                    image={currentTrack?.album?.images[0]?.url || currentTrack?.images[0]?.url}
                    size={300}
                    color="#C968"
                />
            </div>
            <div className="player-right-body flex">
                <p className="song-title">{currentTrack?.name}</p>
                <p className="song-artist">{artists.join(" | ")}</p>
                <div className="player-right-bottom">
                    <div className="song-duration flex">
                        <p className="duration">0:{addZero(Math.round(trackProgress))}</p>
                        <WaveAnimation
                            isPlaying={isPlaying} />
                        <p className="duration">0:30</p>
                    </div>
                    <Controls
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                        total={total}
                    />
                </div>
            </div>
        </div>
    )
}

export default AudioPlayer;