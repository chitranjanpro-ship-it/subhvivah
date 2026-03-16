const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { Pool } = require("pg");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

router.post("/gallery", upload.array("images",5), async (req, res) => {

  try {

    const userId = req.body.userId;

    let uploaded = [];

    for (let file of req.files) {

      const result = await cloudinary.uploader.upload(file.path);

      const imageUrl = result.secure_url;

      await pool.query(
        "INSERT INTO user_gallery (user_id,image_url) VALUES ($1,$2)",
        [userId, imageUrl]
      );

      uploaded.push(imageUrl);

    }

    res.json({
      success:true,
      images:uploaded
    });

  } catch(err){

    res.status(500).json({error:err.message});

  }

});

module.exports = router;