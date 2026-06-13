const express = require("express");
const router = express.Router();

const multer = require("multer");
const fs = require("fs");

const {
  S3Client,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/video",
  upload.single("video"),
  async (req, res) => {
    try {
      const fileContent =
        fs.readFileSync(req.file.path);

      const key =
        `videos/${Date.now()}-${req.file.originalname}`;

      await s3.send(
        new PutObjectCommand({
          Bucket:
            process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: fileContent,
          ContentType:
            req.file.mimetype,
        })
      );

      fs.unlinkSync(req.file.path);

      const url =
        `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      res.json({
        success: true,
        url,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

module.exports = router;