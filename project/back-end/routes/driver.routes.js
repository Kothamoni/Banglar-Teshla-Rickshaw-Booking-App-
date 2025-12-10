const express = require("express");
const multer = require("multer");
const path = require("path");
const Driver = require("../models/driver.model");
const Ride = require("../models/Ride"); // your ride schema
const sendOTP = require("../utils/sendOTP");




const router = express.Router();

// Ensure the 'uploads/' directory exists
const fs = require("fs");
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer file upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// POST: Create a driver profile
router.post("/profile", upload.single("profilePic"), async (req, res) => {
  try {
    const { uniqueId, name, email, phone, address, licenseNumber } = req.body;
    const profilePic = req.file ? req.file.filename : null;

    const driver = new Driver({
      uniqueId,
      name,
      email,
      phone,
      address,
      licenseNumber,
      profilePic,
    });

    await driver.save();
    res.status(201).json({ message: "Driver profile saved successfully" });
  } catch (err) {
    console.error("Error saving driver profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/email/:email", async (req, res) => {
  try {
    const driver = await Driver.findOne({ email: req.params.email });
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.json(driver);
  } catch (error) {
    console.error("Error fetching driver:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH: Update driver profile by email
router.patch("/:email", upload.single("photo"), async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      age: req.body.age,
      phone: req.body.phone,
      location: req.body.location,
      vehicleModel: req.body.vehicleModel,
    };
if (req.file) {
  updates.profilePic = req.file.filename;  // match POST route and schema
}

    const updatedDriver = await Driver.findOneAndUpdate(
      { email: req.params.email },
      updates,
      { new: true }
    );

    if (!updatedDriver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.json(updatedDriver);
  } catch (error) {
    console.error("Error updating driver profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});
async function fetchCurrentRide() {
  try {
    const res = await fetch(`${API_BASE}/rides/driver-current`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const container = document.getElementById('currentRideContainer');

    if (res.status === 404) {
      container.innerHTML = '<p>No active rides at the moment.</p>';
      return;
    }
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch current ride: ${res.status} ${errorText}`);
    }

    const ride = await res.json();

    // Display ride details
    container.innerHTML = `
      <p><strong>Passenger Email:</strong> ${ride.passengerEmail}</p>
      <p><strong>From:</strong> ${ride.from}</p>
      <p><strong>To:</strong> ${ride.to}</p>
      <p><strong>Date:</strong> ${ride.date}</p>
      <p><strong>Time:</strong> ${ride.time}</p>
      <p><strong>Fare:</strong> ${ride.fare}</p>
      <p><strong>Status:</strong> ${ride.status}</p>
      ${ride.status === 'pending' ? '<button id="acceptRideBtn" class="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Accept Ride</button>' : ''}
      ${ride.status === 'accepted' ? `
        <label for="otpInput" class="block mt-4 font-semibold">Enter OTP to complete ride:</label>
        <input type="text" id="otpInput" class="border p-2 rounded mt-1" maxlength="6" />
        <button id="verifyOtpBtn" class="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Verify OTP</button>
      ` : ''}
    `;

    if (ride.status === 'pending') {
      document.getElementById('acceptRideBtn').addEventListener('click', async () => {
        try {
          const acceptRes = await fetch(`${API_BASE}/rides/accept`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const acceptData = await acceptRes.json();
          if (!acceptRes.ok) throw new Error(acceptData.message || 'Failed to accept ride');
          alert(acceptData.message);
          fetchCurrentRide(); // Refresh ride info
        } catch (error) {
          alert(error.message);
        }
      });
    }

    if (ride.status === 'accepted') {
      document.getElementById('verifyOtpBtn').addEventListener('click', async () => {
        const enteredOtp = document.getElementById('otpInput').value.trim();
        if (enteredOtp.length !== 6) {
          return alert('Please enter a valid 6-digit OTP');
        }
        try {
          const verifyRes = await fetch(`${API_BASE}/rides/verify-otp`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ enteredOtp })
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyData.message || 'Failed to verify OTP');
          alert(verifyData.message);
          fetchCurrentRide(); // Refresh ride info
        } catch (error) {
          alert(error.message);
        }
      });
    }

  } catch (error) {
    console.error(error);
    document.getElementById('currentRideContainer').innerHTML = '<p>Error loading current ride.</p>';
  }
}

module.exports = router;
