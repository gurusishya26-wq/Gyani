const mongoose =
  require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: String,

  videos: [
    {
      title: String,
      videoUrl: String,
    },
  ],

  test: {
    questions: [
      {
        question: String,

        options: [String],

        correctAnswer: Number,
      },
    ],
  },
});


const chapterSchema =
  new mongoose.Schema({
    title: String,

    lessons: [
      lessonSchema,
    ],

    test: {
      questions: [
        {
          question: String,

          options: [String],

          correctAnswer: Number,
        },
      ],
    },
  });

const courseSchema =
  new mongoose.Schema({
    type: String,

    parentId: String,

    parentTitle: String,

    subjectName: String,

    title: String,

    description: String,

    price: Number,

    chapters: [
      chapterSchema,
    ],

    test: {
      questions: [
        {
          question: String,

          options: [String],

          correctAnswer: Number,
        },
      ],
    },
  });

module.exports =
  mongoose.model(
    "Course",
    courseSchema
  );