// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String },
    address: { type: String },
    studentClass: { type: String },
    dob: { type: String },
    mobile: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);