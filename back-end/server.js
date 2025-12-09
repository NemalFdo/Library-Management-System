const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const WebSocket = require("ws");

dotenv.config();

// Debug: Check if JWT_SECRET is loaded
console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "YES" : "NO");
console.log("JWT_SECRET value:", process.env.JWT_SECRET);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// WebSocket setup
const wss = new WebSocket.Server({ server });

let clients = []; // List of connected WebSocket clients

// WebSocket Connection Handling
wss.on("connection", (ws) => {
  console.log("A client connected.");
  clients.push(ws); // Add new client to the clients array

  // Message from client
  ws.on("message", (message) => {

    // Broadcast the message to all other clients (admin can see it)
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`Client: ${message}`);
      }
    });
  });

  // Handle WebSocket disconnections
  ws.on("close", () => {
    console.log("Client disconnected.");
    // Remove client from the array
    clients = clients.filter(client => client !== ws);
  });

  // Handle WebSocket errors
  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});

// Endpoint to send a reply from the admin
app.post("/admin/reply", (req, res) => {
  const { message, clientId } = req.body; // clientId will be passed with the request

  const client = clients.find(client => client.clientId === clientId); // Find the specific client

  if (client && client.readyState === WebSocket.OPEN) {
    client.send(`Admin: ${message}`);
    res.status(200).json({ success: true, message: "Reply sent!" });
  } else {
    res.status(404).json({ success: false, message: "Client not found" });
  }
});
