const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;

// Function to initialize transporter (supports test account)
const initTransporter = async () => {
  const isPlaceholder = !process.env.EMAIL_USER || 
                        process.env.EMAIL_USER === 'your-email@gmail.com' ||
                        process.env.EMAIL_USER === 'YOUR_ACTUAL_GMAIL@gmail.com';
  
  if (!isPlaceholder) {
    // Optimized Gmail Transporter
    transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log(`📬 EMAIL READY: Sending from ${process.env.EMAIL_USER}`);
  } else {
    // Automatic Test Mode (Ethereal)
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('\n-----------------------------------------------------------');
      console.log('⚡ TEST EMAIL MODE: Using temporary ethereal.email account');
      console.log(`Log in at: https://ethereal.email/login`);
      console.log('-----------------------------------------------------------\n');
    } catch (err) {
      console.error('Failed to create test account:', err.message);
    }
  }
};

// Initialize on startup
initTransporter().catch(err => console.error('Failed to init email transporter:', err));

// @route   POST /api/email/send
// @desc    Send an email from a sender to an owner
// @access  Public (should ideally be private, but for now we keep it simple)
router.post('/send', async (req, res) => {
  const { to, subject, text, fromName, fromEmail, itemName } = req.body;

  if (!to || !text) {
    return res.status(400).json({ message: 'Receiver and message text are required.' });
  }

  const mailOptions = {
    from: `"${fromName || 'Swap and Share'}" <${process.env.EMAIL_USER}>`,
    to: to,
    replyTo: fromEmail,
    subject: subject || 'Request for swap book',
    text: `Hi there,\n\nYou have a new message regarding your item: "${itemName}".\n\nMessage from ${fromName} (${fromEmail}):\n\n-------------------\n${text}\n-------------------\n\nPlease reply directly to this email to contact the sender.\n\nSent via Swap and Share`,
  };

  try {
    if (!transporter) await initTransporter();
    
    // Check if we are still in test mode to provide the user with a clickable output
    const isTestMode = !process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com';
    
    const info = await transporter.sendMail(mailOptions);
    const testUrl = isTestMode ? nodemailer.getTestMessageUrl(info) : null;

    res.status(200).json({ 
      message: isTestMode ? 'Test email sent! View in terminal link.' : 'Email sent successfully to Gmail!', 
      testUrl: testUrl 
    });
  } catch (error) {
    let userMsg = 'Failed to send email. Check your .env credentials.';
    if (error.message.includes('Invalid login')) {
      userMsg = 'AUTHENTICATION FAILED: Check your App Password in .env';
    }
    res.status(500).json({ message: userMsg, error: error.message });
  }
});

module.exports = router;
