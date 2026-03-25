// backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/check-profile', async (req, res) => {
  const { uid } = req.body;

  try {
    const user = await User.findOne({ uid });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/create-profile', async (req, res) => {
  const { uid, email, name, address, studentClass, dob, mobile } = req.body;

  try {
    const user = new User({
      uid,
      email,
      name,
      address,
      studentClass,
      dob,
      mobile,
    });

    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

module.exports = router;