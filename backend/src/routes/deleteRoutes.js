const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

router.delete("/delete-video", async (req, res) => {
  try {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: "Video URL is required" });
    }

    // Extract key from URL
    const key = videoUrl.split(".amazonaws.com/")[1];

    if (!key) {
      return res.status(400).json({ error: "Invalid video URL format" });
    }

    console.log("🗑️ Deleting video with key:", key);

    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    }).promise();

    console.log("✅ Video deleted successfully from S3");
    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete video from S3" });
  }
});

module.exports = router;