const express = require('express');
const Course = require('../models/Course');

const router = express.Router();

// Create a new course
router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).send('Course created');
  } catch (error) {
    res.status(400).send('Error creating course');
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(400).send('Error fetching courses');
  }
});

module.exports = router;
