import React, { useEffect, useRef, useState } from "react";
import { useFetchRecipientUser } from "./useFetchRecipient";
import { Stack } from "react-bootstrap";
import { SendFill } from "react-bootstrap-icons";
import moment from "moment";
import InputEmojiWithRef from "react-input-emoji";
import "./chat.css";

function ChatBox({userId, currentChat, messages, isMessagesLoading, sendTextMessage}) {

    const recipientUser = useFetchRecipientUser(currentChat, userId);
    const [textMessage, setTextMessage] = useState("");
    const scroll = useRef();

    useEffect(() => {
        scroll.current?.scrollIntoView({behavior: "smooth"});
    },[messages]);

    if (!recipientUser?.recipientUser) {
        return (
            <p style={{ fontWeight:"600", color:"#333", textAlign:"center", width:"100%"}}>
                No conversation selected yet...
            </p>
        );
    }

    if (isMessagesLoading) {
        return (
            <p style={{textAlign:"center", width:"100%"}}>
                Loading Chat...
            </p>
        );
    }

    return (
        <div className="chat-box-container">
            <Stack gap={4} className="chat-box">
                <div className="chat-header">
                    <strong>{recipientUser?.recipientUser?.username}</strong>
                </div>
                <Stack gap={3} className="messages">
                    {messages && messages.map((message, index) => (
                        <Stack key={index} ref={scroll} className={`${message?.senderId === userId ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`}>
                            <span>{message.text}</span>
                            <span className="message-footer">{moment(message.createAt).calendar()}</span>
                        </Stack>
                    ))}
                </Stack>
                <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
                    <InputEmojiWithRef 
                        value={textMessage} 
                        onChange={setTextMessage} 
                        fontFamily="sans-serif" 
                        borderColor="rgba(62, 108, 245, 0.57)"
                    />
                    <button className="send-btn" 
                        onClick={() => sendTextMessage(textMessage, userId, currentChat._id, setTextMessage)}
                    >
                        <SendFill />
                    </button>
                </Stack>
            </Stack>
        </div>
    );
}

export default ChatBox;