// Required Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const Room = require("./models/Room"); // Room model for creating/joining rooms
const Message = require("./models/Message"); // Message model for chat history
require("dotenv").config(); // Load environment variables

// Initialize Express App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Middleware Setup
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected to Atlas..."))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// API to Create Room
app.post("/create-room", async (req, res) => {
  const roomId = Math.random().toString(36).substring(2, 15);
  const password = Math.random().toString(36).substring(2, 15);

  try {
    const newRoom = new Room({ roomId, password });
    await newRoom.save();
    res.status(201).json({ roomId, password });
  } catch (error) {
    res.status(500).json({ message: "Error creating room" });
  }
});

// API to Join Room
app.post("/join-room", async (req, res) => {
  const { roomId, password } = req.body;
  const room = await Room.findOne({ roomId });

  if (room && room.password === password) {
    res.status(200).json({ message: "Room joined successfully" });
  } else {
    res.status(400).json({ message: "Invalid Room ID or Password" });
  }
});

// API to Fetch Chat History for a Room
app.get("/chat-history/:roomId", async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat history" });
  }
});

// Real-Time Chat Functionality with Socket.io
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // User Joins Room
  socket.on("joinRoom", (roomId, name) => {
    socket.join(roomId);
    io.to(roomId).emit("notification", `System: ${name} has joined the room.`);
  });

  // User Sends Message
  socket.on("sendMessage", async (roomId, sender, message) => {
    const newMessage = new Message({ roomId, sender, message });
    await newMessage.save();
    io.to(roomId).emit("receiveMessage", newMessage);
  });

  // User Typing Indicator
  socket.on("typing", (roomId, name) => {
    socket.broadcast.to(roomId).emit("userTyping", `${name} is typing...`);
  });

  // Mark Message as Seen
  socket.on("markSeen", async (roomId, messageId, username) => {
    await Message.findByIdAndUpdate(messageId, {
      $addToSet: { seenBy: username },
    });
    io.to(roomId).emit("seenByUpdate", { messageId, username });
  });

  // User Disconnects
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
