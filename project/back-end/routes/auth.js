require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 🔹 Function to generate manual unique ID
function generateUniqueId(role) {
  const prefix = role.slice(0, 3).toUpperCase();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${Date.now()}-${randomPart}`;
}

// 🔹 Register route
// 🔹 Register route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uniqueId = generateUniqueId(role);

    const user = new User({ uniqueId, name, email, password: hashedPassword, role });
    await user.save();

    // 🔽 Auto-create profile document based on role
    if (role === "driver") {
      const Driver = require("../models/driver.model");
      await new Driver({
        uniqueId,
        name,
        email,
        phone: "",
        location: "",
        vehicleModel: "",
        profilePic: null
      }).save();
    } else if (role === "passenger") {
      const Passenger = require("../models/pprofile");  // adjust path/model name
      await new Passenger({
        uniqueId,
        name,
        email,
        phone: "",
        profilePic: null
      }).save();
    } else if (role === "traffic") {
      const Traffic = require("../models/trafficProfile");  // adjust to your model file
      await new Traffic({
        uniqueId,
        name,
        email,
        designation: "",
        profilePic: null
      }).save();
    } else if (role === "buyer") {
      const Buyer = require("../models/buyer");  // adjust if needed
      await new Buyer({
        uniqueId,
        name,
        email,
        phone: "",
        address: "",
        profilePic: null
      }).save();
    }

    res.status(201).json({ message: "User registered successfully", uniqueId });
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
});

// 🔹 Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      email: user.email,
      name: user.name,
      uniqueId: user.uniqueId, // ✅ Send back UID
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
