const express = require("express");
const Job = require("../models/Job");

const router = express.Router();
const Course = require("../models/Course");

/**
 * ADD JOB
 * POST /api/admin/jobs
 */
router.post("/jobs", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET LATEST 8 JOBS (for homepage)
 * GET /api/admin/jobs/latest
 */
router.get("/jobs/latest", async (req, res) => {
  try {
    const jobs = await Job.find({})
      .sort({ createdAt: -1 }) // newest first
      .limit(8)
      .select("heading companyName createdAt");

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/courses", async (req, res) => {
  try {
    const {
      title,
      description,
      coverImageUrl,
      isPaid,
      price,
      chapters,
    } = req.body;

    if (!title || !description || !coverImageUrl) {
      return res.status(400).json({
        message: "Title, description and cover image required",
      });
    }

    const course = await Course.create({
      title,
      description,
      coverImageUrl,
      isPaid,
      price,
      chapters,
    });

    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
