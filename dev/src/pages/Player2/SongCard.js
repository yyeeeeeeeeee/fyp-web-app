import React, {useEffect, useState} from "react";
import "./songcard.css";
import AlbumImage from "./albumImage";
import AlbumInfo from "./albumInfo";

function SongCard({album}) {
    return (
        <div className="songcard-body flex">
            <AlbumImage url={album?.images?.[0]?.url}/>
            <AlbumInfo album={album}/>
        </div>
    )
}

export default SongCard;