const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { Pool } = require("pg");

const router = express.Router();

// multer setup
const upload = multer({ dest: "uploads/" });

// database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// POST /api/profile-photo
router.post("/profile-photo", upload.single("image"), async (req, res) => {
  try {

    const userId = req.body.userId; // userId required in form-data

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    const imageUrl = result.secure_url;

    // Save Cloudinary URL in Supabase DB (users table)
    await pool.query(
      "UPDATE users SET profile_photo=$1 WHERE id=$2",
      [imageUrl, userId]
    );

    // Response
    res.json({
      success: true,
      imageUrl
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;