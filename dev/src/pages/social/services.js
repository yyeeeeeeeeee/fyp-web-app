export const baseURL = "https://fyp-web-app-sgso.onrender.com/api";
// https://fyp-web-app-sgso.onrender.com

export const postRequest = async (URL, body) => {
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: body,
    });
    
    if (!response.ok) {
        let message;
        if (data?.message) {
            message = data.message;
        } else {
            message = data;
        }
        return {error: true, message};
    }
    
    const data = await response.json();
    return data;
};

export const getRequest = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    if(!response.ok) {
        let message = "An error occured..."
        if(data?.message) {
            message = data.message
        }
        return {error: true, message};
    }
    return data;
}
