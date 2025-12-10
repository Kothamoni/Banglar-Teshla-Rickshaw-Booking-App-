const express = require('express');
const router = express.Router();
const Driver = require('../models/driver.model');

// Helper: Calculate distance (Haversine formula) if you have coords
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

// Dummy map of location names to coordinates (you can replace with real data)
const locationCoords = {
  'BUP': [23.7781, 90.3960],
  'Mirpur-12': [23.7945, 90.3590],
  'NDC': [23.7774, 90.3860],          // National Defense College approx.
  'Osman Hall': [23.7799, 90.3935],  // Inside BUET campus approx.
  'Pallabi': [23.7890, 90.3695],
  'Sagufta': [23.7870, 90.3610],     // Approximate location near Mirpur area
  'Mirpur-11': [23.7912, 90.3660],
  'Mirpur-10': [23.7825, 90.3680],
  'Ideal School': [23.7820, 90.3750], // Ideal School and College area Mirpur
  'Keyari Moon': [23.7855, 90.3605]   // Approximate location near Keyari
};

router.post('/available', async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!(from in locationCoords) || !(to in locationCoords)) {
      return res.status(400).json({ message: 'Invalid from/to location' });
    }

    const [fromLat, fromLon] = locationCoords[from];
    const [toLat, toLon] = locationCoords[to];

    // Calculate distance between from and to
    const distance_km = getDistanceFromLatLonInKm(fromLat, fromLon, toLat, toLon);

    // Get all drivers
    const drivers = await Driver.find({});

    // Attach distance_km to each driver (same for all here, since distance is ride distance)
   const driversWithFare = drivers.map(driver => ({
  _id: driver._id, // Make sure this is present
  name: driver.name,
  phone: driver.phone,
  vehicleModel: driver.vehicleModel,
  distance_km,
  fare: distance_km * 25
}));


    res.json(driversWithFare);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
