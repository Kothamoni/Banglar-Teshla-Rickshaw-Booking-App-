const express = require("express");
const router = express.Router();
const TrafficCase = require("../models/tcase");

// POST /api/cases
router.post("/cases", async (req, res) => {
  try {
    const { name, driverId, violationType, description } = req.body;

    if (!name || !driverId || !violationType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newCase = new TrafficCase({ name, driverId, violationType, description });
    await newCase.save();

    res.status(201).json({ message: "Case filed successfully" });
  } catch (err) {
    console.error("❌ Error saving case:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

