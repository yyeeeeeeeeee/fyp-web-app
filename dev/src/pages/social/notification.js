import React, { useState } from "react";
import { BellFill } from "react-bootstrap-icons";
import { unreadNotificationsFunction } from "./unreadNotifications";
import moment from "moment";
import "./chat.css";

function Notification({userId, notifications, userChats, allUsers, markAllNotificationsAsRead, markNotificationAsRead}) {

    const [isOpen, setIsOpen] = useState(false);
    const unreadNotifications = unreadNotificationsFunction(notifications);
    const modifiedNotifications = notifications.map((n) => {
        const sender = allUsers.find(user => user._id === n.senderId);

        return {
            ...n,
            senderName: sender?.username,
        };
    });

    return (
        <div className="notifications">
            <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
                <BellFill size={30} width={25} height={25}/>
                {unreadNotifications?.length === 0 ? null : (
                    <span className="notification-count">
                        <span>{unreadNotifications?.length}</span>
                    </span>
                )}
            </div>
            {isOpen? 
            <div className="notifications-box">
                <div className="notifications-header">
                    <h3>Notifications</h3>
                    <div className="mark-as-read" onClick={() => markAllNotificationsAsRead(notifications)}>
                        Mark all as read
                    </div>
                </div>
                {modifiedNotifications?.length === 0? 
                    <span className="notification">No notification yet...</span>
                    : null
                }
                {modifiedNotifications && modifiedNotifications.map((n, index) => (
                    <div key={index} className={n.isRead? "notification" : "notification not-read"}
                        onClick={() => {
                            markNotificationAsRead(n, userChats, userId, notifications)
                            setIsOpen(false);
                        }}>
                        <span>{`${n.senderName} sent you a new message`}</span>
                        <span className="notification-time">{moment(n.date).calendar()}</span>
                    </div>
                ))}
            </div>
            : null
            }
            
        </div>
    );
}

export default Notification;