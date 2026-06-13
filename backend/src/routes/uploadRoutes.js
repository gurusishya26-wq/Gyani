const express =
  require("express");

const router =
  express.Router();

const upload =
  require(
    "../middleware/uploadCourseFiles"
  );

router.post(
  "/video",

  upload.single(
    "video"
  ),

  async (
    req,
    res
  ) => {
    res.json({
      success: true,

      url:
        req.file.location,
    });
  }
);

module.exports =
  router;