import express from "express";
import http from "http"; // Required for setting up socket.io
import { Server } from "socket.io";
import cors from "cors"; // Add this if you want CORS in Express
import userRoute from "./resources/user/routes/user.routes.js";
import eventRoute from "./resources/user/routes/event.routes.js";
import Message from "./resources/user/models/messageModels.js";

const app = express();
const server = http.createServer(app); // Create an HTTP server
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Be more specific in production
//     methods: ["GET", "POST"],
//     allowedHeaders: ["my-custom-header"],
//     credentials: true,
//   },
//   transports: ['websocket', 'polling'] // Ensure both WebSocket and polling are enabled
// });
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (adjust for production)
    methods: ['GET', 'POST'],
  },
});

// Middleware for Express
app.use(cors()); // Allow CORS for the Express API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Socket.IO connection
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   // Handle join event
//   socket.on("join", (userId) => {
//     console.log(
//       `User ${userId} is attempting to join with socket ID: ${socket.id}`
//     );
//     socket.join(userId);
//     console.log(`User ${userId} successfully joined room`);
//     socket.emit("joinResponse", {
//       success: true,
//       message: `Joined room for user ${userId}`,
//     });
//   });

//   // Listen for sending messages
//   socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
//     console.log(
//       `Received sendMessage event: senderId=${senderId}, receiverId=${receiverId}, message=${message}`
//     );
//     try {
//       const sender = await User.findById(senderId);
//       const isConnected = sender.connections.some(
//         (connection) =>
//           connection.userId.toString() === receiverId &&
//           connection.status === "accepted"
//       );

//       if (!isConnected) {
//         return socket.emit("error", "You are not connected with this user");
//       }

//       const newMessage = new Message({
//         sender: senderId,
//         receiver: receiverId,
//         message,
//       });

//       await newMessage.save();

//       console.log(`Emitting receiveMessage event to ${receiverId}`);
//       io.to(receiverId).emit("receiveMessage", newMessage);
//       socket.emit("sendMessageResponse", {
//         success: true,
//         message: "Message sent successfully",
//       });
//     } catch (error) {
//       console.error("Message sending error:", error);
//       socket.emit("error", "Failed to send message");
//     }
//   });

//   // Handle user disconnect
//   socket.on("disconnect", () => {
//     console.log("A user disconnected:", socket.id);
//   });
// });

// // Expose an endpoint to join a room (for private messages)
// app.post("/join", (req, res) => {
//   const { userId, socketId } = req.body;

//   const socket = io.sockets.sockets.get(socketId);
//   if (socket) {
//     socket.join(userId); // Join a room based on userId (for private messaging)
//     res.status(200).send(`User with ID: ${userId} joined room.`);
//   } else {
//     res.status(400).send("Invalid socket ID.");
//   }
// });

// app.get("/", (req, res) => {
//   res.send("Welcome to ODS 2024 API");
// });


// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Listen for chat messages
  socket.on('chat', (data) => {
    io.sockets.emit('chat', data);
  });

  // Listen for typing events
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  // Handle socket disconnection
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/dashboard", eventRoute);

export default app;
