const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB, setupAutoReconnect } = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Setup auto-reconnection every 30 seconds
setupAutoReconnect();

const app = express();
const server = http.createServer(app);

// Setup Socket.io for Real-time tracking
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/rides', require('./routes/rideRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log(`✅  User connected: ${socket.id}`);

  // Driver updating location
  socket.on('updateLocation', (data) => {
    io.emit('driverLocationUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌  User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀  Server running on port ${PORT}`);
  console.log(`📍  API: http://localhost:${PORT}/api`);
  console.log(`💫  Real-time: Socket.IO active`);
});
