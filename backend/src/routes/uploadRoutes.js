// src/routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const router = express.Router();

console.log("🚀 Upload Routes Initialized");
console.log("AWS Bucket:", process.env.AWS_BUCKET_NAME);
console.log("AWS Region:", process.env.AWS_REGION);

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const createUpload = (fieldName) => multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) => {
      let folder = "others";
      if (req.path.includes("image")) folder = "images";
      else if (req.path.includes("video")) folder = "videos";
      else if (req.path.includes("pdf")) folder = "pdfs";

      const uniqueName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
      cb(null, uniqueName);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // ACL removed - this was causing the error
  }),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

// ====================== ROUTES ======================

router.post("/upload-pdf", (req, res) => {
  createUpload("pdf").single("pdf")(req, res, (err) => {
    if (err) {
      console.error("❌ PDF Upload Error:", err);
      return res.status(500).json({ error: err.message });
    }
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    console.log("✅ PDF Uploaded Successfully:", req.file.location);
    res.json({ url: req.file.location });
  });
});

router.post("/upload-image", (req, res) => {
  createUpload("image").single("image")(req, res, (err) => {
    if (err) {
      console.error("❌ Image Upload Error:", err);
      return res.status(500).json({ error: err.message });
    }
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });
    console.log("✅ Image Uploaded:", req.file.location);
    res.json({ url: req.file.location });
  });
});

router.post("/upload-video", (req, res) => {
  createUpload("video").single("video")(req, res, (err) => {
    if (err) {
      console.error("❌ Video Upload Error:", err);
      return res.status(500).json({ error: err.message });
    }
    if (!req.file) return res.status(400).json({ error: "No video uploaded" });
    console.log("✅ Video Uploaded:", req.file.location);
    res.json({ url: req.file.location });
  });
});

module.exports = router;