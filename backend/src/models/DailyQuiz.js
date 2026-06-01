const mongoose =
  require("mongoose");

const optionSchema =
  new mongoose.Schema({
    id: String,

    text: String,

    image: String,
  });

const dailyQuizSchema =
  new mongoose.Schema({
    category: String,

    title: String,

    questionImage: String,

    options: [optionSchema],

    correctAnswer: String,

    reward: String,
  });

module.exports =
  mongoose.model(
    "DailyQuiz",
    dailyQuizSchema
  );