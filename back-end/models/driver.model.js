const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
   uniqueId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  age: Number,
  phone: String,
  location: String,
  vehicleModel: String,
 profilePic: String,
});

module.exports = mongoose.model('Driver', driverSchema);
