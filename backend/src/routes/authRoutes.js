// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// ---------------- SIGNUP ----------------
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: {
        username: user.username,
        email: user.email,
        id: user._id
      },
      token: 'temp-jwt-token-' + Date.now(), // You can replace with real JWT later
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
});

// ---------------- LOGIN ----------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        username: user.username,
        email: user.email,
        id: user._id
      },
      token: 'temp-jwt-token-' + Date.now(), // Replace with real JWT later
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
});

module.exports = router;
