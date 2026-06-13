const express = require("express");
const multer = require("multer");
const {
  S3Client,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

router.post(
  "/upload-video",
  upload.single("video"),
  async (req, res) => {
    try {
      console.log("FILE:", req.file);
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const fileName = `lessons/${Date.now()}-${
        req.file.originalname
      }`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
      );

      const videoUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

      res.json({
        success: true,
        url: videoUrl,
      });
    } catch (error) {
      console.error("UPLOAD ERROR:", error);


      res.status(500).json({
        message: "Upload failed",
      });
    }
  }
);

module.exports = router;