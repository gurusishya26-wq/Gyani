const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { storage } = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: async (req, file) => {

    let folder = "daily_quiz";
    let resource_type = "image";

    // If uploading video
    if (file.mimetype.startsWith("video")) {
      folder = "courses/videos";
      resource_type = "video";
    }

    // If uploading image
    if (file.mimetype.startsWith("image")) {
      folder = "courses/images";
      resource_type = "image";
    }

    return {
      folder,
      resource_type,
      allowed_formats: [
        "jpg",
        "png",
        "jpeg",
        "webp",
        "mp4",
        "mov",
        "avi"
      ]
    };
  }
});

const upload = multer({ storage });

module.exports = upload;