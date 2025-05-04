import React, { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "./useFetchRecipient";
import { unreadNotificationsFunction } from "./unreadNotifications";
import "./chat.css";
import { useFetchLatestMessage } from "./useFetchLatestMessage";
import moment from "moment";

function Chat({chat, user, newMessage, onlineUsers, notifications, markThisUserNotificationsAsRead }) {
    const recipientUser = useFetchRecipientUser(chat, user);
    const isOnline = onlineUsers?.some((u) => u?.userId === recipientUser?.recipientUser?._id);
    const unreadNotifications = unreadNotificationsFunction(notifications);
    const thisUserNotification = unreadNotifications?.filter(n => 
        n.senderId === recipientUser?.recipientUser?._id
    );
    const { latestMessage } = useFetchLatestMessage(chat, newMessage, notifications);
    const truncateText = (text) => {
        let shortText = text.substring(0, 20);

        if (text.length > 20) {
            shortText = shortText + "...";
        };

        return shortText;
    };

    return (
        <div>
            <Stack
                direction="horizontal"
                gap={3}
                className="user-card align-items-center p-2 justify-content-between"
                role="button"
                onClick={() => {
                    if(thisUserNotification?.length !== 0) {
                        markThisUserNotificationsAsRead(thisUserNotification, notifications);
                    }
                }}
            >
                <div className="user-chatlist-card d-flex">
                    <div className="me-2">
                        <img src={recipientUser?.recipientUser?.image ?? "/uploads/default.png"}/>
                    </div>
                    <div className="text-content">
                        <div className="name">{recipientUser?.recipientUser?.username}</div>
                        <div className="text">{
                            latestMessage?.text && (<span>{truncateText(latestMessage?.text)}</span>)}
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                    <div className="date">{moment(latestMessage?.createdAt).calendar()}</div>
                    <div className={thisUserNotification?.length > 0? "this-user-notifications": ""}>
                        {thisUserNotification?.length > 0? thisUserNotification?.length : '' }
                    </div>
                    <span className={ isOnline ? "user-online" : ""}></span>
                </div>
            </Stack>
        </div>
    );
}

export default Chat;