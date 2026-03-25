const express = require("express");
const Quiz = require("../models/Quiz"); // no .js needed

const router = express.Router();

router.post("/quizzes", async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;