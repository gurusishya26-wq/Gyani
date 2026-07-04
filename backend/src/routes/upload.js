const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

// ====================== IMAGE UPLOAD ======================
router.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No file uploaded" 
      });
    }

    res.status(200).json({
      success: true,
      url: req.file.location,        // Full S3 public URL
      key: req.file.key,
      message: "Image uploaded successfully"
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message
    });
  }
});

// ====================== VIDEO UPLOAD (Optional - Reuse) ======================
router.post("/upload-video", upload.single("video"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No video uploaded" 
      });
    }

    res.status(200).json({
      success: true,
      url: req.file.location,
      key: req.file.key,
      message: "Video uploaded successfully"
    });
  } catch (error) {
    console.error("Video upload error:", error);
    res.status(500).json({
      success: false,
      message: "Video upload failed",
      error: error.message
    });
  }
});

module.exports = router;