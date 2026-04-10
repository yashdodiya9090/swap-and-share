const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const supabase = require('../config/supabase');

const router = express.Router();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '111471206822-i2b9431ll55cb31ho71ltd7g6o5209pp.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    
    if (!name || !email || !password || !mobile)
      return res.status(400).json({ message: 'All fields are required' });

    // Check if user exists in Supabase
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser)
      return res.status(400).json({ message: 'Email is already registered' });

    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert into Supabase
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert([{ name, email: email.toLowerCase(), mobile, password: hashedPassword }])
      .select()
      .single();

    if (insertError) throw insertError;

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, mobile: user.mobile },
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

    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    if (!user.password)
       return res.status(400).json({ message: 'This account uses Google Login. Please use Google to sign in.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, mobile: user.mobile },
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
    
    const { data: userRecord, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    let user = userRecord;

    if (!user) {
      if (!mobile) {
        return res.status(200).json({ mobileRequired: true, name, email });
      }
      // Create new user in Supabase
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ name, email: email.toLowerCase(), google_id: googleId, mobile }])
        .select()
        .single();
      
      if (insertError) throw insertError;
      user = newUser;
    } else {
      // User exists, check for update
      const updates = {};
      if (!user.google_id) updates.google_id = googleId;
      if (!user.mobile && mobile) updates.mobile = mobile;
      
      if (Object.keys(updates).length > 0) {
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single();
        if (updateError) throw updateError;
        user = updatedUser;
      }

      // If mobile is still missing and not provided
      if (!user.mobile && !mobile) {
         return res.status(200).json({ mobileRequired: true, name, email });
      }
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, mobile: user.mobile },
    });
  } catch (err) {
    console.error('Google Auth Error Details:', err);
    res.status(500).json({ message: 'Google Auth error', error: err.message });
  }
});

module.exports = router;
