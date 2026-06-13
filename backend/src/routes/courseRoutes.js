const express = require("express");
const router = express.Router();

const Course = require("../models/Course");

// ================= CREATE COURSE =================

router.post("/create", async (req, res) => {
  console.log(
  "REQUEST BODY:",
  JSON.stringify(req.body, null, 2)
);

console.log("REQ BODY:", JSON.stringify(req.body, null, 2));
console.log("courseType:", req.body.courseType);
console.log("parentId:", req.body.parentId);
console.log("subjectName:", req.body.subjectName);
  try {
    const {
      courseType,
      parentId,
      subjectName,
      courseTitle,
      description,
      price,
      chapters,
    } = req.body;

    const newCourse = new Course({
  type: courseType,
  parentId,
  subjectName,
  title: courseTitle,
  description,
  price,
  chapters: normalizeChapters(chapters),

  test: normalizeTest(req.body.test),
});
    await newCourse.save();

    res.status(201).json(newCourse);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Create course failed",
    });
  }
});

// ================= GET ALL COURSES =================

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();

    res.json(courses);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Fetch failed",
    });
  }
});

// ================= GET SINGLE COURSE =================

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(
      req.params.id
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(course);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Fetch failed",
    });
  }
});

// ================= UPDATE COURSE =================

router.put("/:id", async (req, res) => {
  try {
    const {
  courseType,
  parentId,
  subjectName,
  courseTitle,
  description,
  price,
  chapters,
  test,
} = req.body;

    const updatedCourse =
  await Course.findByIdAndUpdate(
    req.params.id,
    {
      type: courseType,
      parentId,
      subjectName,
      title: courseTitle,
      description,
      price,
      chapters: normalizeChapters(chapters),
    },
    {
      new: true,
    }
  );
    res.json(updatedCourse);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Update failed",
    });
  }
});

// ================= DELETE COURSE =================

router.delete("/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Delete failed",
    });
  }
});

// ================= NORMALIZE CHAPTERS =================

function normalizeChapters(chapters) {

  console.log(
    "CHAPTERS BEFORE NORMALIZE:",
    JSON.stringify(chapters, null, 2)
  );
  if (!Array.isArray(chapters)) return [];

  return chapters.map((chapter) => ({
    title: chapter.title || "",

    lessons: Array.isArray(chapter.lessons)
      ? chapter.lessons.map((lesson) => ({
          title: lesson.title || "",

          videos: Array.isArray(lesson.videos)
            ? lesson.videos.map((video) => ({
                title: video.title || "",
                videoUrl: video.videoUrl || "",
              }))
            : [],

          test: {
            questions: Array.isArray(
              lesson.test?.questions
            )
              ? lesson.test.questions.map(
                  (question) => ({
                    question:
                      question.question || "",

                    options: Array.isArray(
                      question.options
                    )
                      ? question.options
                      : [],

                    correctAnswer:
                      Number(
                        question.correctAnswer
                      ) || 0,
                  })
                )
              : [],
          },
        }))
      : [],

    test: {
      questions: Array.isArray(
        chapter.test?.questions
      )
        ? chapter.test.questions.map(
            (question) => ({
              question:
                question.question || "",

              options: Array.isArray(
                question.options
              )
                ? question.options
                : [],

              correctAnswer:
                Number(
                  question.correctAnswer
                ) || 0,
            })
          )
        : [],
    },
  }));
}

function normalizeTest(test) {
  return {
    questions: Array.isArray(
      test?.questions
    )
      ? test.questions.map(
          (question) => ({
            question:
              question.question || "",

            options:
              Array.isArray(
                question.options
              )
                ? question.options
                : [],

            correctAnswer:
              Number(
                question.correctAnswer
              ) || 0,
          })
        )
      : [],
  };
}

module.exports = router;