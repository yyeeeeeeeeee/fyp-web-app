import axios from "axios";

// const authEndpoint = "https://accounts.spotify.com/authorize?";
// const clientID = "b58f97e2f31249428194375fd2b32103"
// const clientSecret = "1ee79e07e44d49a3a289b76157d96968"
// const redirectURI = "http://localhost:3000"

// const scopes = 
// [
//     //playback
//     // 'streaming',
//     // 'app-remote-control',
//     // //users
//     // 'user-read-private',
//     // 'user-read-email',
//     // //spotify connect
//     // 'user-read-playback-state',
//     // 'user-modify-playback-state',
//     // 'user-read-currently-playing',
//     //playlists
//     'playlist-read-private', //2
//     // 'playlist-read-collaborative',
//     // 'playlist-modify-private',
//     // 'playlist-modify-public',
//     // //follow
//     // 'user-follow-modify',
//     // 'user-follow-read',
//     // //listening history
//     // 'user-read-playback-position',
//     // 'user-top-read',
//     // 'user-read-recently-played',
//     // //library
//     // 'user-library-modify',
//     'user-library-read', //1
// ];

// export const loginEndpoint = `${authEndpoint}client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;

// NEW: Point to your backend login route
export const loginEndpoint = "https://fyp-web-app-sgso.onrender.com/api/auth/login";

const apiClient = axios.create({
    baseURL: "https://api.spotify.com/v1/",
});

let interceptorId = null;

export const setClientToken = (token) => {
    // Remove previous interceptor if it exists
    if (interceptorId !== null) {
        apiClient.interceptors.request.eject(interceptorId);
    }

    interceptorId = apiClient.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
};

// export const setClientToken = (token) => {
//     apiClient.interceptors.request.use(async function(config) {
//         config.headers.Authorization = "Bearer " + token;
//         return config;
//     });
// };

// export const setClientToken = (token) => {
//     apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// };


export default apiClient;
