const mongoose = require("mongoose");

const ClassSchema =
  new mongoose.Schema({
    classNumber: Number,

    title: String,

    description: String,

    image: String,

    subjects: [
      {
        name: String,

        icon: String,
      },
    ],
  });

module.exports =
  mongoose.model(
    "Class",
    ClassSchema
  );