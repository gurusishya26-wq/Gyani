const express = require("express");
const Job = require("../models/Job"); // ✅ fixed

const router = express.Router();

// CREATE JOB
router.post("/", async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;