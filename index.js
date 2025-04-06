const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const User = require("./models/User");

dotenv.config();
const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Login Endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  // 2. Check if user exists
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // 3. Compare passwords
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json({ message: "Server error." });
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid password." });
        }

        // 4. Success
        res.status(200).json({ message: "Login successful!" });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error.", error: err.message });
    });
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});
