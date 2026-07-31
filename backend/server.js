require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// ====================== DATABASE ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ====================== CORS ======================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://gyani-eight.vercel.app",
      "https://gyani-vxc9.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use(cookieParser());

// ====================== MODELS ======================
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
});

const User = mongoose.model("User", userSchema);

// ====================== AUTH ROUTES ======================

// Register
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      purchasedCourses: []
    });

    res.json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        purchasedCourses: newUser.purchasedCourses
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        purchasedCourses: user.purchasedCourses
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Save Purchase
app.post("/api/save-purchase", async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (!user.purchasedCourses.includes(courseId)) {
      user.purchasedCourses.push(courseId);
      await user.save();
    }

    res.json({ success: true, purchasedCourses: user.purchasedCourses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error saving purchase" });
  }
});

// Get My Courses
app.get("/api/my-courses/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("purchasedCourses");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user.purchasedCourses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching courses" });
  }
});

// ====================== RAZORPAY KEY ======================
app.get("/api/get-razorpay-key", (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID) {
    return res.status(500).json({ error: "Razorpay Key not configured" });
  }
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// ====================== OTHER ROUTES ======================
const uploadRoutes = require("./src/routes/uploadRoutes");
// const deleteRoutes = require("./src/routes/deleteRoutes");
const classRoutes = require("./src/routes/classRoutes");
const competitiveExamRoutes = require("./src/routes/competitiveExamRoutes");
const dailyQuizRoutes = require("./src/routes/dailyQuizRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

app.use("/api", uploadRoutes);
// app.use("/api", deleteRoutes);
app.use("/api", paymentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/competitive-exams", competitiveExamRoutes);
app.use("/api/daily-quizzes", dailyQuizRoutes);
app.use("/api/courses", courseRoutes);

// ====================== TEST ROUTE ======================
app.get("/", (req, res) => {
  res.json({ message: "Backend running successfully" });
});

// ====================== START SERVER ======================
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
