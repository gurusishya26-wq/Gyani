const express = require("express");
const router = express.Router();
const Test = require("../models/Test");

// Create test
router.post("/create", async (req, res) => {
  try {
    const test = new Test(req.body);
    await test.save();
    res.status(201).json({ success: true, test });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tests
router.get("/all", async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get test by ID
router.get("/:id", async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
