// ============================================================
//  server.js  —  Kaku Awuah contact form backend
//  This file receives form submissions and emails them to you.
// ============================================================

// 1. Load the tools (packages) we installed
const express  = require('express');       // web server
const nodemailer = require('nodemailer'); // sends emails
const cors     = require('cors');          // lets your HTML page talk to this server
require('dotenv').config();               // reads your secret passwords from .env file

// 2. Create the app
const app  = express();
const PORT = process.env.PORT || 3000;   // the door number our server listens on

// 3. Middleware — these lines prepare incoming data before we use it
app.use(cors());                          // allow requests from your HTML page
app.use(express.json());                  // understand JSON data from the form
app.use(express.urlencoded({ extended: true })); // also understand regular form data
app.use(express.static('.'));             // serve your HTML/CSS/JS files from this folder


// 4. Set up the email sender using your Gmail
//    We read the password from the .env file (never write passwords directly in code!)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail address (from .env)
    pass: process.env.EMAIL_PASS,   // your App Password (from .env) — NOT your real password
  },
});


// 5. The contact form route — this runs when someone submits your form
//    POST means "send me some data"
//    '/send-email' is the address of this action
app.post('/send-email', async (req, res) => {

  // Pull the values the user typed into the form
  const { name, email, message } = req.body;

  // Basic check — make sure none of the fields are empty
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all fields.'
    });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.'
    });
  }

  // Build the email that will arrive in YOUR inbox
  const mailToYou = {
    from:    process.env.EMAIL_USER,          // Gmail requires "from" to be your own address
    to:      'awuahkaku0@gmail.com',           // YOUR inbox — where you receive messages
    replyTo: email,                            // so when you hit Reply, it goes back to the visitor
    subject: `New message from ${name} — Portfolio`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 100px;">Name:</td>
            <td style="padding: 8px;">${name}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold;">Email:</td>
            <td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; vertical-align: top;">Message:</td>
            <td style="padding: 8px; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
          Sent from your portfolio contact form. Reply directly to this email to respond.
        </p>
      </div>
    `,
  };

  
  const autoReplyToVisitor = {
    from:    process.env.EMAIL_USER,
    to:      email,
    subject: `Thanks for reaching out, ${name}! — Kaku Awuah`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Hi ${name}, thanks for your message! 👋</h2>
        <p>I've received your message and will get back to you as soon as I can.</p>
        <p>Here's a copy of what you sent:</p>
        <blockquote style="border-left: 3px solid #7c3aed; padding-left: 15px; color: #6b7280;">
          ${message}
        </blockquote>
        <p>Talk soon,<br><strong>Kaku Awuah</strong><br>Web Developer &amp; UI/UX Designer</p>
      </div>
    `,
  };

  
  try {
    await transporter.sendMail(mailToYou);          
    await transporter.sendMail(autoReplyToVisitor); 

    
    res.status(200).json({
      success: true,
      message: 'Thank you. Your message has been captured successfully.'
    });

  } catch (error) {
    
    console.error('Email sending failed:', error.message);

    res.status(500).json({
      success: false,
      message: 'Sorry, something went wrong. Please try again later.'
    });
  }
});



app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
  console.log(`📬 Contact form emails will be sent to awuahkaku0@gmail.com`);
});