const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/signup', async (req, res) => {
  const { name, email, mobile, password } = req.body;
  const findQuery = [];
  if (email) findQuery.push({ email });
  if (mobile) findQuery.push({ mobile });
  if (!findQuery.length) return res.status(400).json({ error: 'Email or mobile required' });

  const existingUser = await User.findOne({ $or: findQuery });
  if (existingUser) return res.status(400).json({ error: 'Account already exists with email or mobile' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, mobile, password: hashedPassword });
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { name, email, mobile } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // if (!email && !mobile) return res.status(400).json({ error: 'Enter email or mobile' });

let user;
if (email && email.includes('@')) {
  user = await User.findOne({ email });
} else {
  user = await User.findOne({ mobile: email });
}


   if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  // const user = await User.findOne({ $or: [{ email }, { mobile }] });
  // if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  // ⚠ FIX 2: if the user was created by Google, password is undefined → prevent crash
  if (!user.password) {
    return res.status(400).json({
      error: "This account was created using Google. Please login with Google."
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { name: user.name, email: user.email, mobile: user.mobile } });
});

router.post('/google-signin', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        photo: payload.picture,
        password: undefined 
      });
    }
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token: jwtToken, user });
  } catch (err) {
    res.status(400).json({ error: "Invalid Google token" });
  }
});

module.exports = router;
