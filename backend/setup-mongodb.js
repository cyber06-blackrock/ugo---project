#!/usr/bin/env node
/**
 * Automatic MongoDB Atlas Setup Script
 * This script helps configure and connect to MongoDB Atlas
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI;

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║   🔧 MongoDB Atlas Auto-Connection Setup               ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env file');
  process.exit(1);
}

console.log('📍 Testing MongoDB connection...\n');
console.log(`Connection String: ${MONGO_URI.substring(0, 80)}...\n`);

const testConnection = async () => {
  try {
    console.log('⏳ Attempting to connect to MongoDB Atlas...');
    
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });

    console.log('✅ SUCCESS! MongoDB Atlas is connected!\n');
    console.log(`   Cluster: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Status: ONLINE\n`);

    await mongoose.connection.close();
    
    console.log('🎉 Your database is ready to use!');
    console.log('   Start backend with: npm run dev\n');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Connection Failed\n');
    console.error(`Error: ${error.message}\n`);

    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 SOLUTION:');
      console.log('   1. Go to: https://cloud.mongodb.com');
      console.log('   2. Click "Network Access"');
      console.log('   3. Click "+ Add IP Address"');
      console.log('   4. Select "Allow Access from Anywhere"');
      console.log('   5. Click "Confirm" and wait 2-3 minutes');
      console.log('   6. Run this script again: node setup-mongodb.js\n');
    }

    if (error.message.includes('authentication')) {
      console.log('💡 SOLUTION:');
      console.log('   Your username or password is incorrect');
      console.log('   Check MONGO_URI in backend/.env\n');
    }

    process.exit(1);
  }
};

testConnection();
