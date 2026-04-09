const mongoose = require('mongoose');
const User = require('./models/User'); 
require('dotenv').config();

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- Current Users in Database ---');
    
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log('The database is empty.');
    } else {
      users.forEach((u, i) => {
        console.log(`${i + 1}. Email: ${u.email} | Name: ${u.name}`);
      });
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

listUsers();
