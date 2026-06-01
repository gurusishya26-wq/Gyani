const express = require("express");

const router = express.Router();

const upload =
  require("../middleware/upload");

const Class =
  require("../models/Class");

router.post(
  "/create",

  upload.single("image"),

  async (req, res) => {
    try {
      const {
        classNumber,
        title,
        description,
        subjects,
      } = req.body;

      const newClass =
        new Class({
          classNumber,

          title,

          description,

          image:
            req.file.location,

          subjects:
            JSON.parse(subjects),
        });

      await newClass.save();

      res.json(newClass);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Error",
      });
    }
  }
);

router.get(
  "/",

  async (req, res) => {
    const classes =
      await Class.find();

    res.json(classes);
  }
);
router.delete(
  "/:id",

  async (req, res) => {
    try {
      await Class.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
        message:
          "Class deleted",
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

router.put(
  "/:id",

  upload.single("image"),

  async (req, res) => {
    try {
      const {
        classNumber,
        title,
        description,
        subjects,
      } = req.body;

      const updatedData = {
        classNumber,

        title,

        description,

        subjects:
          JSON.parse(subjects),
      };

      // IF NEW IMAGE EXISTS
      if (req.file) {
        updatedData.image =
          req.file.location;
      }

      const updatedClass =
        await Class.findByIdAndUpdate(
          req.params.id,

          updatedData,

          {
            new: true,
          }
        );

      res.json({
        success: true,

        data: updatedClass,
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