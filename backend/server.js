// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config();
const http = require('http'); // 1. Import http
const { Server } = require('socket.io'); // 2. Import Socket.io

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const bidRoutes = require('./routes/bidRoutes');

const app = express();

// 3. Create the HTTP Server
const server = http.createServer(app);

// 4. Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Match your frontend URL
    methods: ["GET", "POST"]
  }
});

// 5. Attach 'io' to app so controllers can use it
app.set('socketio', io);

// Middleware
app.use(cors());
app.use(express.json());

// 6. Socket connection logic
io.on('connection', (socket) => {
  console.log('User connected to socket:', socket.id);

  // User joins a room named after the Auction ID
  socket.on('joinAuction', (auctionId) => {
    socket.join(auctionId);
    console.log(`User joined room: ${auctionId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log("Could not connect to MongoDB", err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

// 7. IMPORTANT: Listen on 'server', not 'app'
server.listen(PORT, () => console.log(`Server running with Live Bidding on port ${PORT}`));