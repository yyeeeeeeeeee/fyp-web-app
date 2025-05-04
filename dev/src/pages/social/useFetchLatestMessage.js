import { useEffect, useState } from "react"
import { baseURL, getRequest } from "./services";


export const useFetchLatestMessage = (chat, newMessage, notifications) => {
    const [latestMessage, setLatestMessage] = useState(null);

    useEffect(() => {
        const getMessages = async () => {
            const response = await getRequest(`${baseURL}/messages/${chat?._id}`);

            if (response.error) {
                return console.log("Error getting messages...", response);
            }

            const lastMessage = response[response?.length - 1];

            setLatestMessage(lastMessage);
        };
        getMessages();
    },[newMessage, notifications]);

    return {latestMessage};
};