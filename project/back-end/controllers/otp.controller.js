const nodemailer = require("nodemailer");
require("dotenv").config();

const sendOTP = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,      // your Gmail address
        pass: process.env.GMAIL_PASS       // app password from Google
      }
    });

    const mailOptions = {
      from: `Rickshaw App <${process.env.GMAIL_USER}>`,
      to,
      subject: "Your Ride OTP",
      text: `Your OTP is: ${otp}`,
      html: `<h2>Your OTP is: <strong>${otp}</strong></h2>`
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", result.response);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};

module.exports = sendOTP;
