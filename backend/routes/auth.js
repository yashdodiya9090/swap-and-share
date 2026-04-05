const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    
    if (!name || !email || !password || !mobile)
      return res.status(400).json({ message: 'All fields are required' });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(400).json({ message: 'Email is already registered' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, mobile, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    if (!user.password)
       return res.status(400).json({ message: 'This account uses Google Login. Please use Google to sign in.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { idToken, mobile } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { name, email, sub: googleId } = ticket.getPayload();
    
    let user = await User.findOne({ email });

    if (!user) {
      if (!mobile) {
        return res.status(200).json({ mobileRequired: true, name, email });
      }
      // Create new user
      user = new User({ name, email, googleId, mobile });
      await user.save();
    } else {
      // User exists, update googleId if not present
      if (!user.googleId) {
        user.googleId = googleId;
      }
      // If mobile is missing (from old users), require it
      if (!user.mobile && !mobile) {
         return res.status(200).json({ mobileRequired: true, name, email });
      }
      if (mobile) {
        user.mobile = mobile;
      }
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile },
    });
  } catch (err) {
    console.error('Google Auth Error Details:', err);
    res.status(500).json({ message: 'Google Auth error', error: err.message });
  }
});


module.exports = router;

