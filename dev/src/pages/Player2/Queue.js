import React, {useEffect, useState} from "react";
import "./queue.css";

function Queue({tracks, setCurrentIndex}) {
    return (
        <div className="queue-container flex">
            <div className="queue flex">
                <p className="upNext">Up next</p>
                <div className="queue-list">
                    {tracks?.map((track, i) => (
                        <div className="queue-item flex" key={i} onClick={() =>{
                            setCurrentIndex(i)
                        }}>
                            <p className="track-name">{track?.track?.name || track?.name}</p>
                            <p>0:30</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Queue;