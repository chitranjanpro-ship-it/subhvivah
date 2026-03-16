require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const uploadRoute = require("./routes/upload");
const profilePhotoRoute = require("./routes/profile-photo");
const verifyIdRoute = require("./routes/verify-id");
const galleryRoute = require("./routes/gallery");

const app = express();

app.use(cors());
app.use(express.json());


// DATABASE CONNECTION (Supabase PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


// ROOT
app.get("/", (req, res) => {
  res.send("SubhVivah Backend Running");
});


// DATABASE TEST
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// REGISTER
app.post("/register", async (req, res) => {
  try {

    const { name, email, phone, gender, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name,email,phone,gender,password) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [name, email, phone, gender, hashedPassword]
    );

    res.json({
      success: true,
      message: "User registered successfully",
      user: result.rows[0],
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }
});


// LOGIN
app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {

      return res.status(401).json({
        success: false,
        message: "User not found"
      });

    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {

      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });

    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});


// =========================
// ROUTES
// =========================

// Basic image upload
app.use("/api", uploadRoute);

// Profile photo upload
app.use("/api", profilePhotoRoute);

// ID verification OCR
app.use("/api", verifyIdRoute);

// Gallery upload
app.use("/api", galleryRoute);


// SERVER START
const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});