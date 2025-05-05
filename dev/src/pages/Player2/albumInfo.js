import React, {useEffect, useState} from "react";
import "./albuminfo.css";

function AlbumInfo({album}) {
    const artists = [];
    if(album?.artists?.length > 1){
        album?.artists?.forEach((element) => {
            artists.push(element.name);
        });
    } else {
        artists.push(album?.artists?.name);
    }
    

    return (
        <div className="albumInfo-card">
            <div className="albumName-container">
                <div className="marquee">
                    <p>{album?.name + " - " + artists?.join(", ")}</p>
                </div>
            </div> 
            <div className="album-info">
                <p>{`${album?.name} is an ${album?.album_type || "art"} by ${artists?.join(", ")} with ${album?.total_tracks || album?.length} track(s)`}</p>
            </div> 
            <div className="album-release">
                <p>Release Date: {album?.release_date || ""}</p>
            </div> 
        </div> 
    )
}

export default AlbumInfo;