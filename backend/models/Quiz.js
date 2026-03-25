// models/Quiz.js
const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: String,
  image: String
});

const questionSchema = new mongoose.Schema({
  questionText: String,
  questionImage: String,
  options: [optionSchema],
  correctAnswerIndex: Number
});

const quizSchema = new mongoose.Schema({
  title: String,
  description: String,
  questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model("Quiz", quizSchema);
