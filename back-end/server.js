require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const driverRoutes = require('./routes/driver.routes');
const feedbackRoutes = require("./routes/feedback.routes"); 
const authRoutes = require("./routes/auth");
const caseRoutes = require("./routes/case.routes");
const rideRoutes = require("./routes/ride.routes");
const trafficProfileRoutes = require('./routes/traffic.routes'); 
const rickshawRoutes = require('./routes/rickshaw.routes');
const paymentRoutes = require('./routes/payment.routes');

const path = require('path');

const app = express();const passengerProfileRoutes = require('./routes/passenger.routes');
// Allow frontend domain
app.use(cors({
    origin: 'https://banglar-teshla-rickshaw-booking-app.vercel.app', // your Vercel domain
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true
}));

app.use(express.json());

app.use('/api/rickshaws', rickshawRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/passenger', passengerProfileRoutes);
app.use('/api/payment', paymentRoutes);

app.use(express.urlencoded({ extended: true }));
app.use('/api/traffic', trafficProfileRoutes);

app.use('/uploads', express.static('uploads'));
app.use("/api", caseRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use('/api/driver', driverRoutes);

app.use("/api/rides", rideRoutes);
app.use("/api/auth", authRoutes);



console.log("authRoutes:", authRoutes);
console.log("caseRoutes:", caseRoutes);
console.log("rideRoutes:", rideRoutes);


// Connect MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}`)
    );
  })
  .catch(err => console.error("❌ DB Connection Error", err));

// Debug ENV (optional)
console.log("Loaded ENV:", {
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT,
});
