import React, { useEffect, useState } from "react";

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);
    const recipientId = chat?.members.find((id) => id !== user);

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return null;
            const response = await fetch(`http://localhost:5000/api/user/${recipientId}`);
            const data = await response.json();
            if (response.error) {
                setError(data);
            }
            setRecipientUser(data);
        }

        getUser();
    }, [recipientId]);

    return { recipientUser };
}