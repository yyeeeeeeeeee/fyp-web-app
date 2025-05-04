import React, { useEffect, useState } from "react";
import "./widgets.css";
import apiClient from "../../spotify";
import WidgetCard from "./widgetCard";

function Widgets({artistID}) {
    const [similar, setSimilar] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [newRelease, setNewRelease] = useState([]);

    useEffect(() => {
        if (artistID) {
        apiClient.get(`/artists/${artistID}/top-tracks`)
        .then(res => {
            const a = res.data?.tracks.slice(0,3);
            setSimilar(a);
        })
        .catch (err => console.error(err))

        // apiClient.get(`/browse/featured-playlists`)
        // .then(res => {
        //     const a = res.data?.playlists.items.slice(0,3);
        //     setFeatured(a);
        // })
        // .catch (err => console.error(err))

        apiClient.get(`/browse/new-releases`)
        .then(res => {
            const a = res.data?.albums.items.slice(0,3);
            setNewRelease(a);
        })
        .catch (err => console.error(err))
        }
    },[artistID]);
    
    return (
        <div className="widgets-body">
            <WidgetCard title="Top Tracks" similar={similar} />
            {/* <WidgetCard title="Made for You" similar={featured} /> */}
            <WidgetCard title="New Releases" newRelease={newRelease} />
        </div>
    );
}

export default Widgets;