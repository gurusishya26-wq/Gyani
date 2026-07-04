const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

// CREATE S3 CLIENT
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// MULTER CONFIG - Support both Video & Image
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: function (req, file, cb) {
      const folder = file.mimetype.startsWith("video/") ? "course-videos" : "course-images";
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + "-" + file.originalname;
      cb(null, `${folder}/${uniqueName}`);
    },
  }),

  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit (good for videos)

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed!"), false);
    }
  },
});

module.exports = upload;