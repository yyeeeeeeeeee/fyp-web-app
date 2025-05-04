import React from "react";
import "./chat.css";

function PotentialChat({userId, potentialChats, createChat, onlineUsers}) {
    return (
        <div className="all-users">
            {potentialChats && potentialChats.map((u, index) => (
                <div className="single-user" key={index} onClick={() => createChat(userId, u._id)}>
                    {u.username}
                    <span className={ onlineUsers?.some((user) => user?.userId === u?._id)? "user-online" : ""}></span>
                </div>
            ))}
        </div>
    );
}

export default PotentialChat;