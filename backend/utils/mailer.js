const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendStatusUpdate = async (to, complaintTitle, status) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: `Complaint Status Update: ${complaintTitle}`,
      html: `<p>Your complaint <strong>"${complaintTitle}"</strong> status has been updated to <strong>${status.toUpperCase()}</strong>.</p>`
    });
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

module.exports = { sendStatusUpdate };
