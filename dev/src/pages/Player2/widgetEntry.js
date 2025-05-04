import React from "react";
import "./widgetentry.css";

function WidgetEntry({title, subtitle, image}) {
    return (
        <div className="entry-body">
            <img src={image} alt={title} className="entry-image" />
            <div className="entry-right-body">
                <p className="entry-title">{title}</p>
                <p className="entry-subtitle">{subtitle} Songs</p>
            </div>
        </div>
    );
}

export default WidgetEntry;