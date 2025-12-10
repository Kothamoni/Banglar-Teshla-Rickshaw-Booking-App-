// utils/sslcommerz.js
const crypto = require("crypto");

// Replace this with actual payment gateway URL generation logic
function generateSslcommerzUrl(rideId, amount) {
  const txnId = crypto.randomBytes(8).toString("hex");
  const baseURL = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
  
  // This is a mocked redirect URL with query params
  const paymentUrl = `${baseURL}?tran_id=${txnId}&ride_id=${rideId}&amount=${amount}`;
  return paymentUrl;
}

module.exports = generateSslcommerzUrl;
