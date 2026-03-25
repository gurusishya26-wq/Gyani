// backend/index.js
const dotenv = require("dotenv");
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./db');
const adminRoutes = require('./routes/admin');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/users');
const teacherRoutes = require("./routes/teacherRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/teachers", teacherRoutes);
console.log("Teacher routes mounted at /api/teachers");
app.use('/api/users', userRoutes);
app.use("/api/test", require("./routes/test"));
app.use("/api/quiz", require("./routes/quiz"));
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
console.log('Admin routes mounted at /api/admin');
console.log('Course routes mounted at /api/courses');
// Simple test route (to confirm server is alive)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js backend! 🚀' });
});

// MongoDB connection + server start
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    console.log('Starting MongoDB connection...');
    console.log('Using MONGO_URI:', process.env.MONGO_URI || 'NOT SET!');

    await connectDB();

    console.log('MongoDB connected — starting Express server...');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Test endpoint: http://localhost:${PORT}/api/hello`);
    });
  } catch (err) {
    console.error('Startup failed:');
    console.error(err.message || err);
    process.exit(1);
  }
})();