const mongoose = require('mongoose');
const mockDb = require('./mockDb');

let isUsingMockDb = true; // Start as true, will be false when MongoDB connects
let connectionAttempts = 0;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn('⚠️   MONGO_URI is not set. Using mock database...');
    isUsingMockDb = true;
    return;
  }

  try {
    console.log('🔄  Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 8000,
      retryWrites: true,
      maxPoolSize: 10,
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
    console.log('💾  Using MongoDB Atlas for data storage');
    isUsingMockDb = false;
    connectionAttempts = 0;

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️   MongoDB disconnected. Attempting to reconnect…');
      isUsingMockDb = true;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅  MongoDB reconnected');
      isUsingMockDb = false;
      connectionAttempts = 0;
    });

    mongoose.connection.on('error', (err) => {
      console.warn('⚠️   MongoDB error:', err.message);
      isUsingMockDb = true;
    });

  } catch (error) {
    console.warn(`⚠️   MongoDB connection failed: ${error.message}`);
    
    // Only show detailed instructions on first attempt
    if (connectionAttempts === 0) {
      console.log('\n💡  Setup Instructions:');
      console.log('   1. Go to: https://cloud.mongodb.com/v2');
      console.log('   2. Login to your account');
      console.log('   3. Click "Network Access" (left sidebar)');
      console.log('   4. Click "+ Add IP Address"');
      console.log('   5. Select "Allow Access from Anywhere"');
      console.log('   6. Click "Confirm" and wait 1-2 minutes');
      console.log('   7. Restart backend: npm run dev\n');
      console.log('   For now, using in-memory mock database\n');
    }
    
    connectionAttempts++;
    isUsingMockDb = true;
  }
};

// Auto-retry connection every 30 seconds if it's not connected
const setupAutoReconnect = () => {
  setInterval(() => {
    if (isUsingMockDb && mongoose.connection.readyState === 0) {
      connectDB();
    }
  }, 30000);
};

module.exports = { connectDB, setupAutoReconnect, mockDb, isUsingMockDb: () => isUsingMockDb };
