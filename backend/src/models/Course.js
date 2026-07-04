const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
  imageUrl: String,
});

const videoSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
});

const lessonSchema = new mongoose.Schema({
  title: String,
  videos: [videoSchema],
  notesUrl: String,
  test: {
    questions: [questionSchema],
  },
});

const chapterSchema = new mongoose.Schema({
  title: String,
  notesUrl: String,
  lessons: [lessonSchema],
  test: {
    questions: [questionSchema],
  },
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: String,
  type: { type: String, enum: ["Class", "Exam"], required: true },
  parentId: String,
  subjectName: String,

  // ✅ NEW FIELDS ADDED
  imageUrl: String,           // Course Thumbnail Image
  introVideoUrl: String,      // Intro Video

  notesUrl: String,           // Course level notes

  chapters: [chapterSchema],
  test: {
    questions: [questionSchema],
  },
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);