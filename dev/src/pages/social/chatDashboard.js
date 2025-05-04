import React, { useCallback, useEffect, useState } from "react";
import { baseURL, getRequest, postRequest } from "./services";
import { Container, Stack } from "react-bootstrap";
import { io } from "socket.io-client";
import PotentialChat from "./potentialChat";
import ChatBox from "./chatBox";
import Chat from "./chat";
import "./chat.css";

const Social = ({ userId, setNotificationsGlobal, setAllUsersGlobal, 
  setUserChatsGlobal, setMarkAllNotificationsAsRead, setMarkNotificationAsRead }) => {

  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] =useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect()
    };

  },[userId]);

  // add online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", userId);
    socket.on("getOnlineUsers", (res)=> {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };

  },[socket]);

  // send message
  useEffect(() => {
    if (socket === null) return;
    const recipientId = currentChat?.members?.find((user) => user !== userId);

    socket.emit("sendMessage", {...newMessage, recipientId});

  },[newMessage]);

  // receive message and notification
  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", res => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", res => {
      const isChatOpen = currentChat?.members.some(id => id === res.senderId);

      if (isChatOpen) {
        setNotifications(prev => [{...res, isRead:true}, ...prev]);
        setNotificationsGlobal(prev => [{...res, isRead:true}, ...prev]);
      } else {
        setNotifications(prev => [res, ...prev]);
        setNotificationsGlobal(prev => [res, ...prev]);
      }

    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  },[socket, currentChat]);




  useEffect(() => {
    const getUserChats = async () => {
      if (userId) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseURL}/chats/${userId}`);
        setIsUserChatsLoading(false);
        if (response.error) {
          return setUserChatsError(response);
        }
        setUserChats(response);
        setUserChatsGlobal(response);
      }
    }
    getUserChats();
  }, [userId, notifications]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/');
        const users = await response.json();
        if (response.error) {
          console.log("Error fetching users: ", users);
        }
        const pChats = await users.filter((u) => {
          let isChatCreated = false;

          if (userId === u._id) return false;

          if (userChats) {
            isChatCreated = userChats?.some((chat) => {
              return chat.members.includes(u._id);
            });
          }

          return !isChatCreated;
        });

        setPotentialChats(pChats);
        setAllUsers(users);
        setAllUsersGlobal(users);

      } catch (error) {
        console.error("Error to get potential users: ", error.message);
      }
    }
    getUsers();
  }, [userChats]);


  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      const response = await getRequest(`${baseURL}/messages/${currentChat?._id}`);
      setIsMessagesLoading(false);
      if (response.error) {
        return setMessagesError(response);
      }
      setMessages(response);
    }
    getMessages();
  }, [currentChat]);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const sendTextMessage = useCallback( async(textMessage, sender, currentChatId, setTextMessage) => {
    if(!textMessage) return console.log("You must type something...");

    const response = await postRequest(`${baseURL}/messages`,
      JSON.stringify({
        chatId: currentChatId,
        senderId: sender,
        text: textMessage,
      })
    );

    if (response.error) {
      return setSendTextMessageError(response);
    }

    setNewMessage(response);
    setMessages((prev) => [...prev, response]);
    setTextMessage("");

  },[]);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(`${baseURL}/chats`, JSON.stringify({
      firstId,
      secondId,
    }));

    if (response.error) {
      console.log("Error creating chat: ", response.message);
    }

    setUserChats((prev) => [...prev, response]);
    setUserChatsGlobal((prev) => [...prev, response]);

  }, []);
  
  const markAllNotificationsAsRead = useCallback((notifications) => {
    const mNotifications = notifications.map((n) => {
      return {...n, isRead: true};
    });

    setNotifications(mNotifications);
    setNotificationsGlobal(mNotifications);
  },[]);

  const markNotificationAsRead = useCallback((n, userChats, userId, notifications) => {
    //find chat to open
    const desiredChat = userChats.find((chat) => {
      const chatMembers = [userId, n.senderId];
      const isDesiredChat = chat?.members.every((member) => {
        return chatMembers.includes(member);
      });

      return isDesiredChat;
    });

    // mark notification as read
    const mNotifications = notifications.map(el => {
      if(n.senderId === el.senderId) {
        return {...n, isRead: true};
      } else {
        return el;
      };
    });

    updateCurrentChat(desiredChat);
    setNotifications(mNotifications);
    setNotificationsGlobal(mNotifications);

  },[]);

  const markThisUserNotificationsAsRead = useCallback((thisUserNotifications, notifications) => {
    // mark notifications as read
    const mNotifications = notifications.map(el => {
      let notification;

      thisUserNotifications.forEach(n => {
        if(n.senderId === el.senderId) {
           notification = {...n, isRead:true}
        } else {
          notification = el;
        }
      });

      return notification;
    });
    
    setNotifications(mNotifications);
    setNotificationsGlobal(mNotifications);
  },[]);

  // pass globally
  useEffect(() => {
    setMarkAllNotificationsAsRead(() => markAllNotificationsAsRead);
  },[markAllNotificationsAsRead, setMarkAllNotificationsAsRead]);
  
  useEffect(() => {
    setMarkNotificationAsRead(() => markNotificationAsRead);
  },[markNotificationAsRead, setMarkNotificationAsRead]);


  return (
    <div className="chat-container">
      <Container>
        <PotentialChat userId={userId} potentialChats={potentialChats} createChat={createChat} onlineUsers={onlineUsers}/>
        {userChats?.length < 1 ? null : (
          <Stack direction="horizontal" gap={4} className="align-items-start">
            <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
              {isUserChatsLoading && <p>Loading chats...</p>}
              {userChats?.map((chat, idx) => (
                <div key={idx} onClick={() => updateCurrentChat(chat)}>
                  <Chat 
                    chat={chat} 
                    user={userId} 
                    newMessage = {newMessage}
                    onlineUsers={onlineUsers} 
                    notifications={notifications}
                    markThisUserNotificationsAsRead={markThisUserNotificationsAsRead}
                  />
                </div>
              ))}
            </Stack>
            <ChatBox userId={userId} currentChat={currentChat} messages={messages} 
            isMessagesLoading={isMessagesLoading} sendTextMessage={sendTextMessage} />
          </Stack>
        )}
      </Container>
    </div>
  )
};

export default Social;