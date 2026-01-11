const express = require("express");
const upload = require("../middlewares/multer"); // adjust path

const router = express.Router();

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    res.status(201).json({
      message: "Image uploaded successfully",
      imagePath: req.file.filename,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
