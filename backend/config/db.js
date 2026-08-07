const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mockDb = require('./mockDb');

let mongoServer = null;
let isUsingMemoryDb = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (uri) {
    try {
      console.log('🔄 Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000,
        socketTimeoutMS: 4000,
        retryWrites: true,
      });

      console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
      console.log('💾 Using MongoDB Atlas for data storage');
      isUsingMemoryDb = false;
      return;
    } catch (error) {
      console.warn(`⚠️ MongoDB Atlas connection failed: ${error.message}`);
      console.log('🔄 Initializing local MongoDB Server fallback...');
    }
  }

  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    const conn = await mongoose.connect(mongoUri);
    isUsingMemoryDb = true;
    console.log(`✅ MongoDB Memory Server active on: ${conn.connection.host}`);
    console.log('💾 Using active MongoDB instance for all database operations');
  } catch (memError) {
    console.error('❌ Failed to start MongoDB Memory Server:', memError.message);
  }
};

const setupAutoReconnect = () => {};

module.exports = { 
  connectDB, 
  setupAutoReconnect, 
  mockDb, 
  isUsingMockDb: () => false,
  isUsingMemoryDb: () => isUsingMemoryDb 
};

