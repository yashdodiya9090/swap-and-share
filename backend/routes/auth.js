const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const router = express.Router();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '111471206822-i2b9431ll55cb31ho71ltd7g6o5209pp.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Sign user token
 */
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, mobile: user.mobile },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    
    if (!name || !email || !password || !mobile)
      return res.status(400).json({ message: 'All fields are required' });

    // Check if user exists in MongoDB
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(400).json({ message: 'Email is already registered' });

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in MongoDB
    const user = new User({
      name,
      email: email.toLowerCase(),
      mobile,
      password: hashedPassword
    });

    await user.save();

    const token = signToken(user);

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

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    if (!user.password)
       return res.status(400).json({ message: 'This account uses Google Login. Please use Google to sign in.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = signToken(user);

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
      audience: GOOGLE_CLIENT_ID,
    });
    
    const { name, email, sub: googleId } = ticket.getPayload();
    
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      if (!mobile) {
        return res.status(200).json({ mobileRequired: true, name, email });
      }
      
      // Create new user in MongoDB
      user = new User({
        name,
        email: email.toLowerCase(),
        googleId,
        mobile
      });
      await user.save();
    } else {
      // User exists, update if needed
      let hasUpdates = false;
      if (!user.googleId) {
        user.googleId = googleId;
        hasUpdates = true;
      }
      if (!user.mobile && mobile) {
        user.mobile = mobile;
        hasUpdates = true;
      }
      
      if (hasUpdates) await user.save();

      // If mobile is still missing and not provided
      if (!user.mobile && !mobile) {
         return res.status(200).json({ mobileRequired: true, name, email });
      }
    }

    const token = signToken(user);

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
