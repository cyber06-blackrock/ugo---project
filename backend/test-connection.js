// Quick MongoDB Atlas Connection Test
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

console.log('🔍 Testing MongoDB Atlas Connection...\n');
console.log('Connection String:', uri.replace(/:[^:]*@/, ':***@')); // Hide password
console.log('\n🔄 Attempting connection...\n');

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 15000,
})
.then(() => {
  console.log('✅ SUCCESS! MongoDB Atlas connected!');
  console.log('📊 Connection details:');
  console.log('   Host:', mongoose.connection.host);
  console.log('   Database:', mongoose.connection.name);
  console.log('   State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');
  process.exit(0);
})
.catch((error) => {
  console.log('❌ CONNECTION FAILED!\n');
  console.log('Error Type:', error.name);
  console.log('Error Message:', error.message);
  console.log('\n🔍 Possible causes:');
  
  if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
    console.log('   ❌ DNS Resolution Failed');
    console.log('   ❌ Network/Firewall blocking MongoDB');
    console.log('   ❌ ISP DNS not working properly');
    console.log('\n💡 Solutions:');
    console.log('   1. Change DNS to Google DNS (8.8.8.8)');
    console.log('   2. Disable VPN/Proxy if enabled');
    console.log('   3. Check firewall settings');
    console.log('   4. Try from different network (mobile hotspot)');
  } else if (error.message.includes('bad auth')) {
    console.log('   ❌ Username or password incorrect');
    console.log('\n💡 Solution: Check credentials in .env file');
  } else if (error.message.includes('IP')) {
    console.log('   ❌ IP address not whitelisted');
    console.log('\n💡 Solution: Add 0.0.0.0/0 to Network Access in MongoDB Atlas');
  } else {
    console.log('   ❌ Unknown error:', error.message);
  }
  
  process.exit(1);
});
