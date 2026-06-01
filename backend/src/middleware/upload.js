const multer = require("multer");

const multerS3 = require("multer-s3");

const {
  S3Client,
} = require("@aws-sdk/client-s3");

// CREATE S3 CLIENT
const s3 = new S3Client({
  region: process.env.AWS_REGION,

  credentials: {
    accessKeyId:
      process.env.AWS_ACCESS_KEY,

    secretAccessKey:
      process.env.AWS_SECRET_KEY,
  },
});

// MULTER CONFIG
const upload = multer({
  storage: multerS3({
    s3: s3,

    bucket:
      process.env.AWS_BUCKET_NAME,

    contentType:
      multerS3.AUTO_CONTENT_TYPE,

    key: function (
      req,
      file,
      cb
    ) {
      cb(
        null,
        Date.now() +
          "-" +
          file.originalname
      );
    },
  }),
});

module.exports = upload;