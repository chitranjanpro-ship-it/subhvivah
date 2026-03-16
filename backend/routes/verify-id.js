const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Tesseract = require("tesseract.js");
const { Pool } = require("pg");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

router.post("/verify-id", upload.single("image"), async (req, res) => {

  try {

    const userId = req.body.userId;

    const uploadResult = await cloudinary.uploader.upload(req.file.path);

    const imageUrl = uploadResult.secure_url;

    const ocr = await Tesseract.recognize(imageUrl, "eng");

    const extractedText = ocr.data.text;

    await pool.query(
      "INSERT INTO id_verifications (user_id,image_url,ocr_text) VALUES ($1,$2,$3)",
      [userId, imageUrl, extractedText]
    );

    res.json({
      success: true,
      text: extractedText
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});

module.exports = router;