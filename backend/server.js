require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const jobRoutes = require("./routes/jobRoutes");
const courseRoutes = require("./routes/courseRoutes");
const adminQuizRoutes = require("./routes/adminQuizRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const quizRoutes = require("./routes/quiz");
const testRoutes = require("./routes/testRoutes");

const app = express();

/* Middlewares */
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes */
//app.use("/api/courses", courseRoutes);
//app.use("/api/jobs", jobRoutes);
//app.use("/api/tests", testRoutes);
//app.use("/api/admin", adminQuizRoutes);
//app.use("/api/teacher", teacherRoutes);
//app.use("/api/quiz", quizRoutes);

/* Test Route */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* DB Connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

/* Start Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});