const express = require("express");
const router = express.Router();

const Teacher = require("../models/Teacher");
const Subject = require("../models/Subject");

const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", async (req,res)=>{

  try{

    const {
      uid,
      name,
      email,
      mobile,
      qualification,
      experience,
      subjects
    } = req.body;

    let subjectIds = [];

    for (const subjectName of subjects){

      let subject = await Subject.findOne({ name: subjectName });

      if(!subject){
        subject = await Subject.create({ name: subjectName });
      }

      subjectIds.push(subject._id);

    }

    const teacher = await Teacher.create({
      uid,
      name,
      email,
      mobile,
      qualification,
      experience,
      subjects: subjectIds
    });

    res.json({
      success:true,
      teacher
    });

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }

});

/* GET TEACHER BY FIREBASE UID */
router.get("/:uid", async (req,res)=>{

  try{

    const uid = req.params.uid;

    const teacher = await Teacher.findOne({ uid })
      .populate("subjects");

    if(!teacher){
      return res.status(404).json({
        message:"Teacher not found"
      });
    }

    res.json(teacher);

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }

});

/* UPLOAD PROFILE IMAGE */
router.post("/upload-profile/:uid", upload.single("image"), async (req, res) => {
  try {
    const uid = req.params.uid;

    console.log("Incoming file:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary using buffer
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "teacher_profiles" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const teacher = await Teacher.findOneAndUpdate(
      { uid },
      { profileImage: result.secure_url },
      { new: true }
    );

    res.json(teacher);

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

/* UPDATE TEACHER BIO */
router.put("/update-bio/:uid", async (req,res)=>{

  try{

    const { bio } = req.body;

    const teacher = await Teacher.findOneAndUpdate(
      { uid: req.params.uid },
      { bio },
      { new: true }
    );

    res.json(teacher);

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }

});

/* GET ALL TEACHERS */
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("subjects");
    res.json(teachers);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;