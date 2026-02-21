const mongoose = require("mongoose");

const TrafficProfileSchema = new mongoose.Schema({
  uniqueId: { type: String, required: true }, // ✅ Add UID
  name: String,
  email: String,
  phone: String,
  address: String,
  profilePic: String,
});

module.exports = mongoose.model("TrafficProfile", TrafficProfileSchema);
