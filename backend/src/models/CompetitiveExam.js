const mongoose =
  require("mongoose");

const subjectSchema =
  new mongoose.Schema({
    name: String,

    desc: String,
  });

const competitiveExamSchema =
  new mongoose.Schema({
    title: String,

    image: String,

    description: String,

    subjects: [subjectSchema],
  });

module.exports =
  mongoose.model(
    "CompetitiveExam",
    competitiveExamSchema
  );