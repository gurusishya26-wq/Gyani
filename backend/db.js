// backend/db.js
require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Optional: log the URI (without password) for debugging
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    console.log('Attempting to connect to MongoDB...');
    // console.log('URI (hidden password):', uri.replace(/:.*@/, ':****@')); // optional debug

    await mongoose.connect(uri, {
      // These options are recommended in 2025+ (most are default now, but safe to include)
      serverSelectionTimeoutMS: 5000, // timeout after 5 seconds
      maxPoolSize: 10,                // limit connections
    });

    console.log(`MongoDB connected successfully! Host: ${mongoose.connection.host}`);
    console.log(`Database name: ${mongoose.connection.name}`);
  } catch (err) {
    console.error('MongoDB connection failed:');
    console.error(err.message || err);
    // Optional: show full error for debugging
    // console.error(err);
    process.exit(1); // Exit process if DB fails (good for production)
  }
};

module.exports = connectDB;