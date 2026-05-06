
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config();
const http = require('http'); 
const { Server } = require('socket.io'); 

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const bidRoutes = require('./routes/bidRoutes');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});

app.set('socketio', io);

// Middleware
app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('User connected to socket:', socket.id);

  socket.on('joinAuction', (auctionId) => {
    socket.join(auctionId);
    console.log(`User joined room: ${auctionId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log("Could not connect to MongoDB", err));


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;


server.listen(PORT, () => console.log(`Server running with Live Bidding on port ${PORT}`));