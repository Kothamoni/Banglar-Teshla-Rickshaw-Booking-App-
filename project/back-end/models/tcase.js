const mongoose = require("mongoose");

const trafficCaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  driverId: { type: String, required: true },
  violationType: { type: String, required: true },
  description: { type: String },
  filedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TrafficCase", trafficCaseSchema);
