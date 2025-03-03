const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Course = require('../models/Course'); // Assuming you have a Course model

// Add new course route
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { title, description, duration, price, thumbnail } = req.body;

    // Validate input
    if (!title || !description || !duration || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new course
    const newCourse = new Course({
      title,
      description,
      duration,
      price,
      thumbnail, // Handle file upload separately
      createdBy: req.user.id, // Track who created the course
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course added successfully', course: newCourse });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Server error while adding course' });
  }
});

module.exports = router; 