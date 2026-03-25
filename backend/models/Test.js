const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: String,
  image: String
});

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["objective", "subjective"],
    required: true
  },

  questionText: String,
  questionImage: String,

  // Only for objective
  options: [optionSchema],
  correctAnswerIndex: Number,

  // Only for subjective
  marks: Number
});

const testSchema = new mongoose.Schema({
  title: String,
  description: String,
  durationMinutes: Number,
  questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model("Test", testSchema);
