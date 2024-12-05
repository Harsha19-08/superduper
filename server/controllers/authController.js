const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, userType: user.userType },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { email, password, name, userType } = req.body;

    // Validate required fields
    if (!email || !password || !name || !userType) {
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
      userType
    });

    // Generate token
    const token = generateToken(user);

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
    res.status(400).json({
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validate required fields
    if (!email || !password || !userType) {
      return res.status(400).json({
        message: 'Please provide email, password and user type'
      });
    }

    // Find user
    const user = await User.findOne({ email, userType }).select('+password');
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user);

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
    res.status(400).json({
      message: error.message
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    // Get token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'Please log in to get access'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Check if user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: 'User no longer exists'
      });
    }

    // Grant access
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
};
