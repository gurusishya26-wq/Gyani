const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({

  uid: String,

  name: String,

  email: String,

  mobile: String,

  qualification: String,

  experience: Number,

  bio: {
    type: String,
    default: ""
  },


  profileImage: {
    type: String,
    default: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
  },

  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject"
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Teacher", TeacherSchema);