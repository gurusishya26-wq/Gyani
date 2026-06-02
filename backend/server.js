require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

// IMPORT CLASS ROUTES
const classRoutes = require("./src/routes/classRoutes");

const competitiveExamRoutes =
  require(
    "./src/routes/competitiveExamRoutes"
  );

  const dailyQuizRoutes =
  require(
    "./src/routes/dailyQuizRoutes"
  );

const app = express();

const PORT = process.env.PORT || 5000;

// ====================== MONGODB CONNECTION ======================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log("✅ MongoDB connected")
  )
  .catch((err) =>
    console.log(
      "❌ MongoDB connection error:",
      err
    )
  );

// ====================== MIDDLEWARE ======================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://gyani-eight.vercel.app"
    ],
    credentials: true
  })
);

app.use(express.json());

app.use(cookieParser());

// ====================== USER SCHEMA ======================

const userSchema = new mongoose.Schema({
  name: String,

  email: String,

  password: String,
});

const User = mongoose.model(
  "User",
  userSchema
);

// ====================== REGISTER ======================

app.post(
  "/api/register",

  async (req, res) => {
    const {
      name,
      email,
      password,
    } = req.body;

    try {
      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {
        return res
          .status(400)
          .json({
            msg:
              "User already exists",
          });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const newUser =
        await User.create({
          name,

          email,

          password:
            hashedPassword,
        });

      res.json({
        message:
          "User registered successfully",

        user: newUser,
      });
    } catch (err) {
      console.log(
        "❌ REGISTER ERROR:",
        err
      );

      res.status(500).json({
        msg: "Server error",
      });
    }
  }
);

// ====================== LOGIN ======================

app.post(
  "/api/login",

  async (req, res) => {
    const { email, password } =
      req.body;

    try {
      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res
          .status(400)
          .json({
            msg: "User not found",
          });
      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {
        return res
          .status(400)
          .json({
            msg:
              "Invalid password",
          });
      }

      res.json({
        message:
          "Login successful",

        user,
      });
    } catch (err) {
      console.log(
        "❌ LOGIN ERROR:",
        err
      );

      res.status(500).json({
        msg: "Server error",
      });
    }
  }
);

// ====================== SAVE USER ======================

app.post(
  "/api/save-user",

  async (req, res) => {
    const { name, email } =
      req.body;

    try {
      let user =
        await User.findOne({
          email,
        });

      if (!user) {
        user =
          await User.create({
            name,
            email,
          });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json({
        msg:
          "Error saving user",
      });
    }
  }
);

// ====================== CLASS ROUTES ======================

app.use(
  "/api/classes",
  classRoutes
);

app.use(
  "/api/competitive-exams",

  competitiveExamRoutes
);

app.use(
  "/api/daily-quizzes",

  dailyQuizRoutes
);

// ====================== TEST ROUTE ======================

app.get("/", (req, res) => {
  res.json({
    message: "Backend running",
  });
});

// ====================== START SERVER ======================

app.listen(PORT, () => {
  console.log(
    `🚀 Backend running on http://localhost:${PORT}`
  );
});
