#!/usr/bin/env node
/**
 * Test script to verify MongoDB connection
 * Run: node test-connection.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  console.log('\n🔍 Testing MongoDB connection...\n');

  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGO_URI not found in .env');
    console.log('\n📋 Please follow these steps:');
    console.log('   1. Read: ../MONGODB_SETUP.md');
    console.log('   2. Create a free MongoDB Atlas cluster');
    console.log('   3. Copy your connection string');
    console.log('   4. Update backend/.env with MONGO_URI=<your-connection-string>\n');
    process.exit(1);
  }

  console.log(`📍 Connection string (first 80 chars): ${uri.substring(0, 80)}...`);

  try {
    console.log('⏳ Connecting to MongoDB...');

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });

    console.log('✅ MongoDB connected successfully!\n');
    console.log(`   Cluster: ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   State: ${mongoose.connection.readyState === 1 ? 'OPEN' : 'CLOSED'}\n`);

    await mongoose.connection.close();
    console.log('✅ Connection test passed! Ready to start backend.\n');

  } catch (error) {
    console.error('❌ Connection failed:\n');
    console.error(`   Error: ${error.message}\n`);
    
    if (error.message.includes('getaddrinfo') || error.message.includes('ENOTFOUND')) {
      console.log('💡 Tip: Check your internet connection and MONGO_URI format\n');
    }
    if (error.message.includes('authentication')) {
      console.log('💡 Tip: Check your username and password in MONGO_URI\n');
    }
    if (error.message.includes('timeout')) {
      console.log('💡 Tip: Check if your IP is whitelisted in MongoDB Atlas\n');
    }

    process.exit(1);
  }
};

testConnection();
