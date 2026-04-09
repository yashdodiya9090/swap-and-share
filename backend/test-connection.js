const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

console.log('--- Database Connection Test ---');
console.log('Testing URI:', uri.replace(/:([^@]+)@/, ':****@')); // Hide password in logs

mongoose.connect(uri)
  .then(() => {
    console.log('✅ SUCCESS: Connected to MongoDB Atlas successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ FAILURE: Could not connect to MongoDB Atlas.');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    
    if (err.message.includes('authentication failed')) {
      console.log('\n👉 TIP: Check if your Username/Password in .env matches the one in Atlas "Database Access".');
    } else if (err.message.includes('ECONNREFUSED') || err.message.includes('timeout')) {
      console.log('\n👉 TIP: Check your "Network Access" in Atlas. Make sure your IP is whitelisted.');
    }
    
    process.exit(1);
  });
