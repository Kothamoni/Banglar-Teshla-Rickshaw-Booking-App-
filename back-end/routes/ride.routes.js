const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Ride = require("../models/Ride");
const Driver = require("../models/driver.model");  // add driver model here
const sendOTP = require("../utils/sendOTP");

// GET current active ride for driver
router.get('/driver-current', authMiddleware, async (req, res) => {
  console.log('req.user:', req.user);
  try {
    const driver = await Driver.findOne({ email: req.user.email });
    if (!driver) return res.status(404).json({ message: "Driver profile not found" });

    console.log('Looking for rides with driverId:', driver._id);

    const ride = await Ride.findOne({ driverId: driver._id, status: { $in: ["pending", "accepted"] } });
    if (!ride) return res.status(404).json({ message: "No active ride." });

    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST passenger requests a ride from driver
router.post("/request", authMiddleware, async (req, res) => {
  console.log("Ride request body:", req.body);
  console.log("Passenger from token:", req.user);
  try {
    const { driverId, from, to, date, time, fare } = req.body;
    if (!driverId || !from || !to || !date || !time || !fare) {
      return res.status(400).json({ message: 'Missing required ride info' });
    }

    const passengerEmail = req.user.email;

    const ride = new Ride({
      driverId,
      passengerEmail,
      from,
      to,
      date,
      time,
      fare
    });

    await ride.save();
    res.status(201).json({ message: "Ride requested successfully", ride });

  } catch (err) {
    console.error("Ride request error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST driver verifies OTP to complete ride
router.post("/verify-otp", authMiddleware, async (req, res) => {
  try {
    const { enteredOtp } = req.body;

    const driver = await Driver.findOne({ email: req.user.email });
    if (!driver) return res.status(404).json({ message: "Driver profile not found" });

    const ride = await Ride.findOne({ driverId: driver._id, status: "accepted" });
    if (!ride) return res.status(404).json({ message: "No ride in progress." });

    if (ride.otp === enteredOtp) {
      ride.status = "completed";
      await ride.save();
      res.json({ message: "Ride completed successfully!" });
    } else {
      res.status(400).json({ message: "Invalid OTP." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// POST /api/rides/confirm - driver confirms ride, generates & sends OTP

// POST /api/rides/confirm — driver confirms a ride (pending → accepted + send OTP)
router.post("/confirm", authMiddleware, async (req, res) => {
  try {
    // Find driver by email from token
    const driver = await Driver.findOne({ email: req.user.email });
    if (!driver) return res.status(404).json({ message: "Driver profile not found" });

    // Find ride with pending status assigned to this driver
    const ride = await Ride.findOne({ driverId: driver._id, status: "pending" });
    if (!ride) return res.status(404).json({ message: "No pending ride found to confirm." });

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update ride status and OTP
    ride.status = "accepted";
    ride.otp = otp;
    await ride.save();

    // Send OTP to passengerEmail (use your sendOTP util)
    await sendOTP(ride.passengerEmail, otp);

    res.json({ message: "Ride confirmed and OTP sent to passenger." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error confirming ride." });
  }
});
// Stop ride
router.post('/stop/:id', authMiddleware, async (req, res) => {
  try {
    const rideId = req.params.id;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.status === "Completed") {
      return res.status(400).json({ message: "Ride already completed" });
    }

    ride.status = "Completed";
    await ride.save();

    res.status(200).json({ message: "Ride marked as completed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.post('/test-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    await sendOTP(email, otp);
    res.json({ message: `OTP sent to ${email}`, otp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send test OTP" });
  }
});




module.exports = router;
