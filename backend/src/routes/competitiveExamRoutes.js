const express =
  require("express");

const router =
  express.Router();

const upload =
  require("../middleware/upload");

const CompetitiveExam =
  require("../models/CompetitiveExam");

// CREATE
router.post(
  "/create",

  upload.single("image"),

  async (req, res) => {
    try {
      const {
        title,
        description,
        subjects,
      } = req.body;

      const newExam =
        new CompetitiveExam({
          title,

          description,

          image:
            req.file.location,

          subjects:
            JSON.parse(subjects),
        });

      await newExam.save();

      res.json({
        success: true,

        data: newExam,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Create failed",
      });
    }
  }
);

// GET ALL
router.get(
  "/",

  async (req, res) => {
    try {
      const exams =
        await CompetitiveExam.find();

      res.json(exams);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Fetch failed",
      });
    }
  }
);

// DELETE
router.delete(
  "/:id",

  async (req, res) => {
    try {
      await CompetitiveExam.findByIdAndDelete(
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

// UPDATE
router.put(
  "/:id",

  upload.single("image"),

  async (req, res) => {
    try {
      const {
        title,
        description,
        subjects,
      } = req.body;

      const updatedData = {
        title,

        description,

        subjects:
          JSON.parse(subjects),
      };

      if (req.file) {
        updatedData.image =
          req.file.location;
      }

      const updatedExam =
        await CompetitiveExam.findByIdAndUpdate(
          req.params.id,

          updatedData,

          {
            new: true,
          }
        );

      res.json({
        success: true,

        data: updatedExam,
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

module.exports = router;