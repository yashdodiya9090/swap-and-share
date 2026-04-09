const mongoose = require('mongoose');
const User = require('./models/User'); // Import the model
require('dotenv').config();

const emailToRemove = 'vrushankshah'; // Search pattern

async function removeUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');
    
    // Find possible matches
    const users = await User.find({ email: new RegExp(emailToRemove, 'i') });
    
    if (users.length === 0) {
      console.log(`No user found with "${emailToRemove}" in their email.`);
    } else {
      console.log(`Found ${users.length} user(s):`);
      users.forEach(u => console.log(` - ${u.email} (ID: ${u._id})`));
      
      const result = await User.deleteMany({ email: new RegExp(emailToRemove, 'i') });
      console.log(`Successfully deleted ${result.deletedCount} user(s).`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

removeUser();
