const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Global variables to store user details
global.currentUser = {};


// Signup Endpoint
router.post("/signup", async (req, res) => {
  const { email, username, password, phoneNumber, profileImage } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const user = new User({ email, username, password, phoneNumber, profileImage, role: "user" });
    user.phoneNumber = "" + user.phoneNumber;
    user.profileImage = "" + user.profileImage;
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
});

// Signin Endpoint
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // First, check if the user is an admin
    let user = await User.findOne({ email, role: "admin" });

    // If admin not found, check for regular user
    if (!user) {
      user = await User.findOne({ email});
      if (!user) return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Create JWT token with user role (admin or user)
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send response with token and user details
    res.status(200).json({
      message: "Signin successful",
      token,
      user: { id: user._id, email: user.email, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Error signing in", error: err.message });
  }
});

router.post("/admin/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin in the Admin model
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password); // Use bcrypt compare method
    if (!isMatch) return res.status(401).json({ message: "Invalid admin credentials" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: { id: admin._id, email: admin.email, username: admin.username },
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});



module.exports = router;
