const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use another SMTP provider
      auth: {
        user: process.env.EMAIL_USER, // e.g., yourname@gmail.com
        pass: process.env.EMAIL_PASS, // app password (not your Gmail password)
      },
    });

    const mailOptions = {
      from: `"Rickshaw App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Ride OTP Verification',
      html: `<h2>Your OTP is: <strong>${otp}</strong></h2><p>Please share it with your driver to start the ride.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${info.response}`);
  } catch (error) {
    console.error(`Error sending OTP to ${email}:`, error.message);
  }
};

module.exports = sendOTP;
