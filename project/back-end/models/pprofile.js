const mongoose = require("mongoose");

const passengerProfileSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,},
     uniqueId: { type: String, required: true },
      phone: String,
  address: String,
  profilePic: String, // << ensures always stored as lowercase

});

module.exports = mongoose.model("PassengerProfile", passengerProfileSchema);
