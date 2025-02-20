const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const authMiddleware = require('../middleware/auth');

// Middleware to check MongoDB connection
const checkDbConnection = (req, res, next) => {
  if (req.app.get('mongoose').connection.readyState !== 1) {
    return res.status(500).json({ 
      message: 'Database connection is not ready',
      error: 'MongoDB connection error'
    });
  }
  next();
};

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des cours',
      error: error.message 
    });
  }
});

// Get a single course
router.get('/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findOne({ id: courseId });
    
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Erreur lors de la récupération du cours:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Delete a course
router.delete('/:id', checkDbConnection, async (req, res) => {
  try {
    console.log('Deleting course:', req.params.id);
    const course = await Course.findOne({ id: req.params.id });
    
    if (!course) {
      console.log('Course not found:', req.params.id);
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete the course icon if it exists
    if (course.icon) {
      const iconPath = path.join(__dirname, '..', course.icon);
      if (fs.existsSync(iconPath)) {
        fs.unlinkSync(iconPath);
        console.log('Course icon deleted:', iconPath);
      }
    }

    await course.deleteOne();
    console.log('Course deleted successfully');
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ 
      message: 'Failed to delete course',
      error: error.message 
    });
  }
});

// Add this new route for course creation
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Verify user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ 
        message: 'Only teachers can create courses' 
      });
    }

    // Get instructor name from user data or request body
    const instructorName = req.user.name || req.body.instructor || 'Unknown Instructor';

    const courseData = {
      ...req.body,
      id: req.body.title.toLowerCase().replace(/\s+/g, '-'),
      instructor: instructorName,
      enrolledCount: 0,
      rating: 0,
      students: 0
    };

    const course = new Course(courseData);
    await course.save();

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ 
      message: 'Error creating course',
      error: error.message 
    });
  }
});

module.exports = router; 