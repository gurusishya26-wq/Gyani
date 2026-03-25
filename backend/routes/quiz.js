// routes/quiz.js
const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");

router.post("/create", async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get latest quiz
router.get("/latest", async (req, res) => {
  try {
    const latestQuiz = await Quiz.findOne().sort({ createdAt: -1 });

    if (!latestQuiz) {
      return res.status(404).json({ message: "No quiz found" });
    }

    res.json(latestQuiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
