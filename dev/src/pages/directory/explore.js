import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./explore.css";

function Explore({ userId }) {
    const id = userId || localStorage.getItem("userId") || "";
    const navigate = useNavigate();

    const [artists, setArtists] = useState([]);
    const [artistsData, setArtistsData] = useState([]);
    const filterList = [
        "#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
        "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ];
    const [selectedFilter, setSelectedFilter] = useState("#");

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/artists/`);
                const data = await response.json();
                if (data)
                    setArtists(data);
            } catch (error) {
                console.error("Failed to fetching artitst directory: ", error);
            }
        }

        fetchAllData();
    }, []);


    useEffect(() => {
        if (artists) {
            // from artists to join artistID by , to ids
            const ids = artists.map(artist => artist.artistID).join(',');

            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/spotify/artists/${encodeURIComponent(ids)}`);
                    const data = await response.json();
                    if (data)
                        setArtistsData(data);
                } catch (error) {
                    console.error("Failed to fetching artitst directory: ", error);
                }
            }

            fetchData();
        };
    }, [artists]);

    const handleArtist = (data) => {
        if (id)
            navigate(`/u/${id}/artist/${data.id}`, {state: {artistData: data}});
        else
            navigate(`/artist/${data.id}`, {state: {artistData: data}});
    }

    return (
        <div className="explore-container">
            <p>Explore</p>
            <div className="explore-body">
                <div className="top-filters-container">
                    {filterList.map((filter, i) => (
                        <div className={`filters-card ${selectedFilter === filter ? 'active' : ''}`}
                            key={i}
                            onClick={() => setSelectedFilter(filter)}>
                            <p className="filter-item">{filter}</p>
                        </div>
                    ))}
                </div>

                {/* {artistsData && 
                    <ExploreCard artistsData={artistsData} />
                } */}
                <div className="explore-context">
                    {artistsData && artistsData.artists
                        ?.filter((artistData) => {
                            const firstLetter = artistData.name[0].toUpperCase();
                            // If selectedFilter is "#", display all artists
                            if (selectedFilter === "#") {
                                return true;  // No filtering, display all artists
                            }
                            return firstLetter === selectedFilter;
                        })
                        .map((artistData) => (
                            <div className="context-card" key={artistData.id} onClick={()=> {handleArtist(artistData)}}>
                                <img
                                    className="context-card-img"
                                    src={artistData?.images[0]?.url}
                                    alt={artistData?.name}
                                />
                                <p className="context-card-name">{artistData?.name}</p>
                            </div>
                        ))}
                </div>

            </div>
        </div>
    );
}

export default Explore;