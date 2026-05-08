const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const mailToYou = {
    from: process.env.EMAIL_USER,
    to: 'awuahkaku0@gmail.com',
    replyTo: email,
    subject: `New message from ${name} — Portfolio`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">New Contact Form Submission</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold; width: 100px;">Name:</td><td style="padding: 8px;">${name}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 8px; font-weight: bold; vertical-align:top;">Message:</td><td style="padding: 8px; white-space: pre-wrap;">${message}</td></tr>
        </table>
        <p style="color:#6b7280; font-size:12px; margin-top:20px;">Sent from your portfolio contact form.</p>
      </div>`,
  };

  const autoReply = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Thanks for reaching out, ${name}! — Kaku Awuah`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #7c3aed;">Hi ${name}, thanks for your message! 👋</h2>
        <p>I've received your message and will get back to you as soon as I can.</p>
        <p>Here's a copy of what you sent:</p>
        <blockquote style="border-left: 3px solid #7c3aed; padding-left: 15px; color: #6b7280;">${message}</blockquote>
        <p>Talk soon,<br><strong>Kaku Awuah</strong><br>Web Developer & UI/UX Designer</p>
      </div>`,
  };

  try {
    await transporter.sendMail(mailToYou);
    await transporter.sendMail(autoReply);
    res.status(200).json({ success: true, message: 'Thank you. Your message has been captured successfully.' });
  } catch (error) {
    console.error('Email sending failed:', error.message);
    res.status(500).json({ success: false, message: 'Sorry, something went wrong. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Emails will be sent to awuahkaku0@gmail.com`);
});
