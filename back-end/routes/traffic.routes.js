const express = require("express");
const multer = require("multer");
const TrafficProfile = require("../models/trafficProfile.model");

const router = express.Router();

// 🔹 File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// 🔹 POST traffic profile
router.post("/profile", upload.single("profilePic"), async (req, res) => {
  try {
    const { uniqueId, name, email, phone, address } = req.body;
    const profilePic = req.file.filename;

    const profile = new TrafficProfile({ uniqueId, name, email, phone, address, profilePic });
    await profile.save();

    res.status(201).json({ message: "Profile saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 GET latest profile
router.get("/profile", async (req, res) => {
  try {
    const profile = await TrafficProfile.findOne().sort({ _id: -1 });
    if (!profile) return res.status(404).json({ error: "No profile found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
