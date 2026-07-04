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

// ====================== MIDDLEWARE ======================
app.use(
  cors({
    origin: "https://gyani-vxc9.onrender.com/",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ====================== MODELS ======================
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// ====================== AUTH ROUTES ======================
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

app.post("/api/save-user", async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ name, email });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error saving user" });
  }
});

// ====================== UPLOAD ROUTES ======================
const uploadRoutes = require("./src/routes/uploadRoutes");
app.use("/api", uploadRoutes);           // ← This makes /api/upload-image etc. work

// ====================== OTHER ROUTES ======================
const classRoutes = require("./src/routes/classRoutes");
const competitiveExamRoutes = require("./src/routes/competitiveExamRoutes");
const dailyQuizRoutes = require("./src/routes/dailyQuizRoutes");
const courseRoutes = require("./src/routes/courseRoutes");

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