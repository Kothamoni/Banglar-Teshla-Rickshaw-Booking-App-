const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  passengerEmail: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  from: String,
  to: String,
  date: String,
  time: String,
  fare: Number,
  otp: String,
  status: { type: String, default: "pending" } // pending | accepted | completed
});

module.exports = mongoose.model("Ride", rideSchema);