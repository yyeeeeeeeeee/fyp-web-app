// ----- REQUIRES -----
// ## NODEJS
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const path = require('path');
// ## SOCKETIO
const {Server} = require("socket.io");
const http = require("http");


// ----- ROUTES -----
// ## SPOTIFY 
const spotifyRoutes = require("./api/routes/spotifyRoute");
// const playerAuth = require("./api/routes/playerAuth"); //webplayer sdk
// const authRoutes = require("./api/routes/auth");
const spotifyAuthRoutes = require("./api/routes/spotifyAuth");
const previewRoutes = require("./api/routes/previewRoute");


const userRoutes = require("./routes/userRoute");
const playlistRoutes = require("./routes/playlistRoute");
const accRoutes = require("./routes/accRoutes");
const trackRoutes = require("./routes/trackRoute");
const artistRoutes = require("./routes/artistRoute");

const chatRoutes = require("./routes/chatRoute");
const messageRoutes = require("./routes/messageRoute");

// ## RECOMMENDATION
const recommendRoutes = require("./recommendation/recommendRoute");



// ----- INITIALIZE -----
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000", // React frontend
    credentials: true,
  }));  
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

// ----- NODE -----
// app.use('/auth', authRoutes);
// DATABASE
app.use("/api/u", accRoutes);
app.use("/api/user", userRoutes);

app.use("/api/playlist", playlistRoutes);
app.use("/api/playlist-tracks", trackRoutes);

app.use("/api/artists", artistRoutes);

// CHAT
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// SPOTIFY API
// app.use("/",playerAuth);
app.use('/api/spotify',spotifyRoutes);

//RECOMMENDATION ROUTE
app.use("/",recommendRoutes);

// GET PREVIEW URL ROUTE
app.use("/api/song", previewRoutes);

// SPOTIFY API FRONTEND AND BACKEND CONNECTION
app.use("/api/auth",spotifyAuthRoutes);

// Serve static files from /public/uploads
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));



// ----- SOCKETIO -----
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // your frontend
    credentials: true,
    }
});

let onlineUsers = [];

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("New connected:", socket.id);

  // listen to a connection
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some(user => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id
      });
      
    console.log("onlineUsers: ", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);

  });

  // add message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(user => user.userId === message.recipientId)
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });

});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

