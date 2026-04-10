const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connString = process.env.MONGO_URI;
    
    if (!connString || connString.includes("INSERT_YOUR_MONGO_URI_HERE")) {
      console.warn("⚠️  MongoDB URI missing in .env. Skipping MongoDB connection.");
      return;
    }

    const conn = await mongoose.connect(connString);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not exit process, let the app run (maybe using Supabase fallback or just showing error)
  }
};

module.exports = connectDB;
