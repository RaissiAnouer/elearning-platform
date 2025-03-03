const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, username, phone, role, grade } = req.body;

    // Add validation
    if (!email || !password || !username || !phone || !role) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: 'Email, password, username, phone, and role are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
        details: 'Email or username is already registered'
      });
    }

    // Create new user with proper defaults
    const newUser = new User({
      name: name?.trim() || username.trim(), // Use username as name if not provided
      email: email.toLowerCase().trim(),
      password: await bcrypt.hash(password, 10),
      username: username.trim(),
      phone: phone.trim(),
      role: role.toLowerCase(),
      grade: grade?.trim(),
      createdAt: new Date()
    });

    // Save user
    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { 
        id: newUser._id, 
        role: newUser.role, 
        email: newUser.email,
        name: newUser.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        username: newUser.username,
        role: newUser.role,
        grade: newUser.grade,
        createdAt: newUser.createdAt,
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Server error during signup',
      details: error.message,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.json({
      status: 'success',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during login'
    });
  }
});

// Update profile route
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    console.log('Profile update request received:', req.body);
    console.log('User from token:', req.user);
    
    const { name, email, phone, grade } = req.body;
    
    if (!name || !email || !phone) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        message: 'Name, email and phone are required' 
      });
    }

    const userId = req.user.id;
    console.log('Looking up user with ID:', userId);
    
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Found user:', user);

    // Update user fields
    user.name = name.trim();
    user.email = email.toLowerCase().trim();
    user.phone = phone.trim();
    if (user.role === 'student' && grade) {
      user.grade = grade.trim();
    }

    await user.save();
    console.log('User updated successfully');

    // Generate new token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Profile updated successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        username: user.username,
        role: user.role,
        grade: user.grade,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      message: error.message || 'Server error during profile update'
    });
  }
});

// Verify token route
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.json({ valid: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.json({ valid: false });
    }

    res.json({ valid: true, user });
  } catch (error) {
    console.error('Token verification error:', error);
    res.json({ valid: false });
  }
});

// Export the router
module.exports = router; 