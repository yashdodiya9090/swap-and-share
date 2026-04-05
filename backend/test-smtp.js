const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('Testing SMTP with:', process.env.EMAIL_USER);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP Connection Successful!');
  } catch (error) {
    console.error('❌ SMTP Connection Failed:');
    console.error('Error Code:', error.code);
    console.error('Response:', error.response);
    console.error('Message:', error.message);
  }
}

testEmail();
