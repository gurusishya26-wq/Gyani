const express =
  require("express");

const router =
  express.Router();

const DailyQuiz =
  require("../models/DailyQuiz");

const upload =
  require("../middleware/upload");

// CREATE QUIZ
router.post(
  "/create",

  upload.fields([
    {
      name: "questionImage",
      maxCount: 1,
    },

    {
      name: "optionImageA",
      maxCount: 1,
    },

    {
      name: "optionImageB",
      maxCount: 1,
    },

    {
      name: "optionImageC",
      maxCount: 1,
    },

    {
      name: "optionImageD",
      maxCount: 1,
    },
  ]),

  async (req, res) => {
    try {
      const {
        category,
        title,
        reward,
        correctAnswer,
      } = req.body;

      const options = [
        {
          id: "A",
          text:
            req.body.optionAText,

          image:
            req.files[
              "optionImageA"
            ]?.[0]?.location || "",
        },

        {
          id: "B",
          text:
            req.body.optionBText,

          image:
            req.files[
              "optionImageB"
            ]?.[0]?.location || "",
        },

        {
          id: "C",
          text:
            req.body.optionCText,

          image:
            req.files[
              "optionImageC"
            ]?.[0]?.location || "",
        },

        {
          id: "D",
          text:
            req.body.optionDText,

          image:
            req.files[
              "optionImageD"
            ]?.[0]?.location || "",
        },
      ];

      const newQuiz =
        new DailyQuiz({
          category,

          title,

          reward,

          correctAnswer,

          options,

          questionImage:
            req.files[
              "questionImage"
            ]?.[0]?.location || "",
        });

      await newQuiz.save();

      res.json(newQuiz);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Create failed",
      });
    }
  }
);

// GET ALL QUIZZES
router.get(
  "/",

  async (req, res) => {
    try {
      const quizzes =
        await DailyQuiz.find();

      res.json(quizzes);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Fetch failed",
      });
    }
  }
);

// GET RANDOM QUIZ
router.get(
  "/random",

  async (req, res) => {
    try {
      const randomQuiz =
        await DailyQuiz.aggregate([
          {
            $sample: {
              size: 1,
            },
          },
        ]);

      res.json(
        randomQuiz[0]
      );
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Random quiz failed",
      });
    }
  }
);
// UPDATE QUIZ
router.put(
  "/:id",

  upload.fields([
    {
      name: "questionImage",
      maxCount: 1,
    },
    {
      name: "optionImageA",
      maxCount: 1,
    },
    {
      name: "optionImageB",
      maxCount: 1,
    },
    {
      name: "optionImageC",
      maxCount: 1,
    },
    {
      name: "optionImageD",
      maxCount: 1,
    },
  ]),

  async (req, res) => {
    try {
      const quiz =
        await DailyQuiz.findById(
          req.params.id
        );

      if (!quiz) {
        return res.status(404).json({
          message: "Quiz not found",
        });
      }

      quiz.category =
        req.body.category;

      quiz.title =
        req.body.title;

      quiz.reward =
        req.body.reward;

      quiz.correctAnswer =
        req.body.correctAnswer;

      // Question image
      if (
        req.files?.questionImage?.[0]
          ?.location
      ) {
        quiz.questionImage =
          req.files.questionImage[0].location;
      }

      quiz.options = [
        {
          id: "A",
          text:
            req.body.optionAText,

          image:
            req.files?.optionImageA?.[0]
              ?.location ||
            quiz.options?.[0]?.image ||
            "",
        },

        {
          id: "B",
          text:
            req.body.optionBText,

          image:
            req.files?.optionImageB?.[0]
              ?.location ||
            quiz.options?.[1]?.image ||
            "",
        },

        {
          id: "C",
          text:
            req.body.optionCText,

          image:
            req.files?.optionImageC?.[0]
              ?.location ||
            quiz.options?.[2]?.image ||
            "",
        },

        {
          id: "D",
          text:
            req.body.optionDText,

          image:
            req.files?.optionImageD?.[0]
              ?.location ||
            quiz.options?.[3]?.image ||
            "",
        },
      ];

      await quiz.save();

      res.json({
        success: true,
        message:
          "Quiz Updated",
        quiz,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Update failed",
      });
    }
  }
);
// DELETE QUIZ
router.delete(
  "/:id",

  async (req, res) => {
    try {
      await DailyQuiz.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Delete failed",
      });
    }
  }
);

module.exports = router;