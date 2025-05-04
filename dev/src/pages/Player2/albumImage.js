import React, { useEffect, useState } from "react";
import "./albumimage.css";

function AlbumImage({ url }) {
    return (
        <div className="albumImage-body flex">
            <img src={url} alt="album art" className="albumImage-art" />
            <div className="albumImage-shadow">
                <img src={url} alt="shadow" className="albumImage-shadow" />
            </div>
        </div>
    )
}

export default AlbumImage;