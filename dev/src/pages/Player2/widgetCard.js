import React from "react";
import "./widgetcard.css";
import WidgetEntry from "./widgetEntry";
import { IconContext } from "react-icons";
import { FiChevronRight } from "react-icons/fi";

function WidgetCard({ title, similar, featured, newRelease }) {
    return (
        <div className="widgetcard-body">
            <p className="widget-title">{title}</p>
            {similar ? similar.map((track) => (
                <WidgetEntry
                    title={track?.album?.name}
                    subtitle={track?.album?.total_tracks}
                    image={track?.album?.images[2]?.url}
                />
            ))
            //  : featured ? featured.map((playlist) => (
            //     <WidgetEntry
            //         title={playlist?.name}
            //         subtitle={playlist?.tracks?.total}
            //         image={playlist?.images[2]?.url}
            //     />
            // )) 
            : newRelease ? newRelease.map((album) => (
                <WidgetEntry
                    title={album?.name}
                    subtitle={album?.artists[0]?.name}
                    image={album?.images[2]?.url}
                />
            )) : null
            }
            <div className="widget-fade">
                <div className="fade-button">
                    <IconContext.Provider value={{size:"24px", color:"#C4D0E3"}}>
                        <FiChevronRight />
                    </IconContext.Provider>
                </div>
            </div>
        </div>
    );
}

export default WidgetCard;