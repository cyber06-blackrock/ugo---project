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
    origin: process.env.NODE_ENV === 'production' 
      ? [
          'https://frontend-iota-two-94.vercel.app',
          'https://ugo-frontend.vercel.app',
          'https://ugo-jaipur.vercel.app', 
          /\.vercel\.app$/  // Allow all Vercel preview deployments
        ]
      : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Make io accessible to routes/controllers
app.set('io', io);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://frontend-iota-two-94.vercel.app',
        'https://ugo-frontend.vercel.app',
        'https://ugo-jaipur.vercel.app',
        /\.vercel\.app$/
      ]
    : '*',
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`, req.body);
  next();
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/rides', require('./routes/rideRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Debug endpoint to check mock DB
app.get('/api/debug/users', (req, res) => {
  const { mockDb, isUsingMockDb } = require('./config/db');
  if (isUsingMockDb && isUsingMockDb()) {
    res.json({ users: mockDb.users, usingMockDb: true });
  } else {
    res.json({ message: 'Not using mock DB', usingMockDb: false });
  }
});

// Seed mock database endpoint
app.post('/api/debug/seed', async (req, res) => {
  const { mockDb, isUsingMockDb } = require('./config/db');
  if (!isUsingMockDb || !isUsingMockDb()) {
    return res.json({ message: 'Not using mock DB - seeding not needed' });
  }

  try {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('driver123', 10);

    // Create test users
    const amit = await mockDb.createUser({
      name: 'Amit',
      email: 'amit@test.com',
      password: hashedPassword,
      role: 'driver',
      isAvailable: false,
      vehicleType: 'UgoX',
      vehicleName: 'Maruti Swift',
      licensePlate: 'RJ 14 AB 1234',
      rating: 4.9,
      totalRides: 150,
      location: { lat: 26.9124, lng: 75.7873 }
    });

    res.json({ 
      message: 'Mock database seeded successfully', 
      users: { amit },
      credentials: 'amit@test.com / driver123'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

server.listen(PORT, async () => {
  console.log(`🚀  Server running on port ${PORT}`);
  console.log(`📍  API: http://localhost:${PORT}/api`);
  console.log(`💫  Real-time: Socket.IO active`);
  
  // Seed mock database disabled - users must register manually
  // Uncomment below to enable automatic seeding for testing
  /*
  setTimeout(async () => {
    const { isUsingMockDb } = require('./config/db');
    if (isUsingMockDb && isUsingMockDb()) {
      try {
        const seedMockDatabase = require('./seedMockDb');
        await seedMockDatabase();
      } catch (err) {
        console.error('❌ Failed to seed mock database:', err.message);
      }
    }
  }, 2000);
  */
});
