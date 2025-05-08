import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./artistdetails.css";

function ArtistDetails({ userId }) {
    const location = useLocation();
    const navigate = useNavigate();
    const artistsData = location.state.artistData;
    const id  = userId || localStorage.getItem("userId");

    const [toptracks, setTopTracks] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [relatedAlbums, setRelatedAlbums] = useState([]);
    const [relatedArtists, setRelatedArtists] = useState([]);
    const [relatedPlaylists, setRelatedPlaylists] = useState([]);
    const [relatedTracks, setRelatedTracks] = useState([]);

    useEffect(() => {
        const fetchTopTracks = async () => {
            try {
                const response = await fetch(`https://fyp-web-app-sgso.onrender.com/api/spotify/a/${artistsData.id}`);
                const data = await response.json();
                if (data)
                    setTopTracks(data);
            } catch (error) {
                console.error("Failed to fetching artitst directory: ", error);
            }
        }
        fetchTopTracks();
    }, []);

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await fetch(`https://fyp-web-app-sgso.onrender.com/api/spotify/a/albums/${artistsData.id}`);
                const data = await response.json();
                if (data)
                    setAlbums(data.items);
            } catch (error) {
                console.error("Failed to fetching artitst directory: ", error);
            }
        }
        fetchAlbums();
    }, []);


    useEffect(() => {
        const fetchRelatedAlbumData = async () => {
            try {
                const response = await fetch(`https://fyp-web-app-sgso.onrender.com/api/spotify/related-albums?artistName=${artistsData.name}`);
                const data = await response.json();
                if (data)
                    setRelatedAlbums(data.items);
            } catch (error) {
                console.error("Failed to fetching artitst directory: ", error);
            }
        }
        fetchRelatedAlbumData();
    }, []);


    useEffect(() => {
        const fetchRelatedArtistData = async () => {
            try {
                const response = await fetch(`https://fyp-web-app-sgso.onrender.com/api/spotify/related-artists?artistName=${artistsData.name}`);
                const data = await response.json();
                if (data)
                    setRelatedArtists(data.items);
            } catch (error) {
                console.error("Failed to fetching artitst directory: ", error);
            }
        }
        fetchRelatedArtistData();
    }, []);


    useEffect(() => {
        const fetchRelatedPlaylistData = async () => {
            try {
                const response = await fetch(`https://fyp-web-app-sgso.onrender.com/api/spotify/related-playlists?artistName=${artistsData.name}`);
                const data = await response.json();
                if (data)
                    setRelatedPlaylists(data.items);
            } catch (error) {
                console.error("Failed to fetching artitst directory: ", error);
            }
        }
        fetchRelatedPlaylistData();
    }, []);


    useEffect(() => {
        const fetchRelatedTrackData = async () => {
            try {
                const response = await fetch(`https://fyp-web-app-sgso.onrender.com/api/spotify/related-tracks?artistName=${artistsData.name}`);
                const data = await response.json();
                if (data)
                    setRelatedTracks(data.items);
            } catch (error) {
                console.error("Failed to fetching artitst directory: ", error);
            }
        }
        fetchRelatedTrackData();
    }, []);


    const handleNextArtist = (data) => {
        if (id)
            navigate(`/u/${id}/artist/${data.id}`,{state: {artistData: data}});
        else
            navigate(`/artist/${data.id}`,{state: {artistData: data}});
    }

    const handleNextAlbum = (data) => {
        if (id)
            navigate(`/u/${id}/player`,{state: {playId: data.id, type: "album"}});
        else
            navigate(`/login`);
    }

    const handleNextTrack = (data) => {
        if (id)
            navigate(`/u/${id}/player`,{state: {playId: data.id, type: "track"}});
        else
            navigate(`/login`);
    }

    const handleNextPlaylist = (data) => {
        if (id)
            navigate(`/u/${id}/player`,{state: {playId: data.id, type: "playlist"}});
        else
            navigate(`/login`);
    }

    return (
        <div className="artist-details-container">
            <div className="artist-details-body">
                <div className="artist-details-top">
                    <div className="artist-info">
                        <img className="artist-img" src={artistsData.images[0].url} alt={artistsData.name} />
                        <div className="artist-desc">
                            <p className="artist-name">{artistsData.name}</p>
                            <p className="artist-type">{artistsData.type}</p>
                            <p className="artist-followers">{artistsData.followers.total} Followers</p>
                        </div>
                    </div>
                </div>
                
                <p className="details-subtitle">Top Tracks</p>
                <div className="bottom-toptracks">
                    {Array.isArray(toptracks) && toptracks.length > 0 ? (
                        toptracks.map((toptrack, index) => (
                            <div className="bottom-toptracks-body" key={index} onClick={() => handleNextTrack(toptrack)}>
                                <img className="bottom-body-img" src={toptrack?.album?.images[0]?.url} alt={toptrack?.album?.id} />
                                <div className="bottom-body-top-track">
                                <p className="bottom-body-title">{toptrack?.name}</p>
                                <p className="bottom-body-artists">{toptrack?.artists?.map((artist) => artist?.name).join(', ')}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No top tracks found.</p>
                    )}
                </div>

                <div className="artist-details-bottom">
                    <div className="bottom-body">
                        
                        <p className="details-subtitle">Albums</p>
                        <div className="bottom-albums">
                            {Array.isArray(albums) && albums.length > 0 ? (
                                albums
                                .filter((albums) => {
                                    return albums !== null;
                                })
                                .map((album, index) => (
                                    <div className="bottom-albums-body" key={index} onClick={() => handleNextAlbum(album)}>
                                        <img className="bottom-body-img" src={album?.images[0]?.url} alt={album?.id} />
                                        <p className="bottom-body-title">{album?.name}</p>
                                        <p className="bottom-body-artists">{album?.artists?.map((artist) => artist?.name).join(', ')}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No albums found.</p>
                            )}
                        </div>
                        <br></br>
                        <p className="details-subtitle">Related Albums</p>
                        <div className="bottom-relatedAlbums">
                            {Array.isArray(relatedAlbums) && relatedAlbums.length > 0 ? (
                                relatedAlbums
                                .filter((relatedAlbums) => {
                                    return relatedAlbums !== null;
                                })
                                .map((relatedAlbum, index) => (
                                    <div className="bottom-relatedAlbum-body" key={index} onClick={() => handleNextAlbum(relatedAlbum)}>
                                        <img className="bottom-body-img" src={relatedAlbum?.images[0]?.url} alt={relatedAlbum?.id} />
                                        <p className="bottom-body-title">{relatedAlbum?.name}</p>
                                        <p className="bottom-body-artists">{relatedAlbum?.artists?.map((artist) => artist?.name).join(', ')}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No related albums found.</p>
                            )}
                        </div>
                        
                        <p className="details-subtitle">Related Artists</p>
                        <div className="bottom-relatedArtists">
                            {Array.isArray(relatedArtists) && relatedArtists.length > 0 ? (
                                relatedArtists
                                .filter((relatedArtists) => {
                                    return relatedArtists !== null;
                                })
                                .map((relatedArtist, index) => (
                                    <div className="bottom-relatedArtist-body" key={index} onClick={() => handleNextArtist(relatedArtist)}>
                                        <img className="bottom-body-img" src={relatedArtist?.images[0]?.url} alt={relatedArtist?.id} />
                                        <p className="bottom-body-title">{relatedArtist?.name}</p>
                                        <p className="bottom-body-artists">{relatedArtist?.followers?.total}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No related artists found.</p>
                            )}
                        </div>

                        <p className="details-subtitle">Related Playlists</p>
                        <div className="bottom-relatedPlaylists">
                            {Array.isArray(relatedPlaylists) && relatedPlaylists.length > 0 ? (
                                relatedPlaylists
                                    .filter((relatedPlaylist) => {
                                        return relatedPlaylist !== null;
                                    })
                                    .map((relatedPlaylist, index) => (
                                        <div className="bottom-relatedPlaylist-body" key={index} onClick={() => handleNextPlaylist(relatedPlaylist)}>
                                            <img className="bottom-body-img" src={relatedPlaylist?.images[0]?.url} alt={relatedPlaylist?.id} />
                                            <p className="bottom-body-title">{relatedPlaylist?.name}</p>
                                            <p className="bottom-body-artists">{relatedPlaylist?.owner?.display_name}</p>
                                        </div>
                                    ))
                            ) : (
                                <p>No related playlists found.</p>
                            )}
                        </div>

                        <p className="details-subtitle">Related Tracks</p>
                        <div className="bottom-relatedTracks">
                            {Array.isArray(relatedTracks) && relatedTracks.length > 0 ? (
                                relatedTracks
                                    .filter((relatedTrack) => {
                                        return relatedTrack !== null;
                                    })
                                    .map((relatedTrack, index) => (
                                        <div className="bottom-relatedTrack-body" key={index} onClick={() => handleNextAlbum(relatedTrack)}>
                                            <img className="bottom-body-img" src={relatedTrack?.album?.images[0]?.url} alt={relatedTrack?.album?.id} />
                                            <p className="bottom-body-title">{relatedTrack?.name}</p>
                                            <p className="bottom-body-artists">{relatedTrack?.artists?.map((artist) => artist?.name).join(', ')}</p>
                                        </div>
                                    ))
                            ) : (
                                <p>No related tracks found.</p>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </div >
    );
}

export default ArtistDetails;
