const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, userType } = req.body;

    // Validate required fields
    if (!email || !password || !name || !userType) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
      userType
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send response without password
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user. Please try again.' 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validate required fields
    if (!email || !password || !userType) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Check if user exists with email and userType
    const user = await User.findOne({ email, userType }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials or user type' 
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send response without password
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in. Please try again.' 
    });
  }
});

module.exports = router;
