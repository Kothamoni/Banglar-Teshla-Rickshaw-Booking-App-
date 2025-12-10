const express = require("express");
const multer = require("multer");
const PassengerProfile = require("../models/pprofile");


const router = express.Router();

// Multer file upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// POST passenger profile
router.post("/profile", upload.single("profilePic"), async (req, res) => {
  try {
    const { uniqueId, name, email, phone, address } = req.body;
    const profilePic = req.file ? req.file.filename : null; // optional

    const profile = new PassengerProfile({ uniqueId, name, email, phone, address, profilePic });
    await profile.save();

    res.status(201).json({ message: "Passenger profile saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET latest passenger profile
router.get("/profile", async (req, res) => {
  try {
    const profile = await PassengerProfile.findOne().sort({ _id: -1 });
    if (!profile) return res.status(404).json({ error: "No passenger profile found" });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// GET passenger profile by email
router.get('/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const profile = await PassengerProfile.findOne({ email });
    if (!profile) return res.status(404).json({ error: "Passenger profile not found" });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
router.patch('/:email', upload.single('photo'), async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const updates = {
      name: req.body.name,
      phone: req.body.phone,
      location: req.body.location,
    };

    // if file uploaded, add profilePic field
    if (req.file) {
      updates.profilePic = req.file.filename;
    } else if (req.body.photo) {
      updates.profilePic = req.body.photo;
    }

    const updatedProfile = await PassengerProfile.findOneAndUpdate(
      { email },
      updates,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Passenger profile not found" });
    }

    res.json({ message: "Profile updated successfully", profile: updatedProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
