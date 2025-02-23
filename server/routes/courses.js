const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadDir;
    if (file.fieldname === 'video') {
      uploadDir = path.join(__dirname, '../uploads/videos');
    } else {
      uploadDir = path.join(__dirname, '../uploads/documents');
    }
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    console.log('Upload directory:', uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Sanitize filename
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + sanitizedName;
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('Processing file:', file.originalname);
    console.log('Mimetype:', file.mimetype);
    
    if (file.fieldname === 'video') {
      if (!file.mimetype.startsWith('video/')) {
        return cb(new Error('Only video files are allowed!'), false);
      }
    } else if (file.fieldname === 'document') {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid document type!'), false);
      }
    }
    cb(null, true);
  }
});

// Get all courses
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;
  const query = category ? { category } : {};
  
  try {
    const courses = await Course.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Course.countDocuments(query);
    
    res.json({
      courses,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single course
router.get('/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    console.log('Fetching course with ID:', courseId);
    
    const course = await Course.findOne({ id: courseId })
      .select('-__v');
    
    if (!course) {
      console.log('Course not found');
      return res.status(404).json({ 
        message: 'Course not found',
        requestedId: courseId 
      });
    }
    
    console.log('Found course:', course.title);
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ 
      message: 'Error fetching course details',
      error: error.message 
    });
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

// Update video upload route
router.post('/:courseId/videos', authMiddleware, upload.single('video'), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const course = await Course.findOne({ id: courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create the video object
    const newVideo = {
      _id: new mongoose.Types.ObjectId(),
      title,
      url: `/uploads/videos/${req.file.filename}`,
      duration: '0:00', // You may want to extract actual duration
      createdAt: new Date(),
      description: req.body.description || ''
    };

    // Add the video to the course
    course.videos.push(newVideo);
    await course.save();
    
    // Return the newly created video
    res.status(201).json({ 
      message: 'Video uploaded successfully', 
      video: newVideo
    });

  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ 
      message: 'Error uploading video', 
      error: error.message 
    });
  }
});

// Update document upload route
router.post('/:courseId/documents', authMiddleware, upload.single('document'), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No document file uploaded' });
    }

    const course = await Course.findOne({ id: courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create the document object
    const newDocument = {
      _id: new mongoose.Types.ObjectId(), // Generate new MongoDB ObjectId
      title,
      url: `/uploads/documents/${req.file.filename}`,
      type: req.file.mimetype,
      size: `${(req.file.size / 1024).toFixed(2)} KB`,
      createdAt: new Date(),
      description: req.body.description || '',
      category: req.body.category || 'Uncategorized'
    };

    // Add the document to the course
    course.documents.push(newDocument);
    await course.save();

    // Return the newly created document
    res.status(201).json({ 
      message: 'Document uploaded successfully',
      document: newDocument
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ 
      message: 'Error uploading document',
      error: error.message 
    });
  }
});

// Add this new route for document deletion
router.delete('/:courseId/documents/:documentId', authMiddleware, async (req, res) => {
  try {
    const { courseId, documentId } = req.params;
    
    // Find the course
    const course = await Course.findOne({ id: courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the document
    const document = course.documents.find(doc => doc._id.toString() === documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Verify that the user is the course instructor
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can delete documents' });
    }

    // Delete the physical file
    const filePath = path.join(__dirname, '..', document.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove the document from the course
    course.documents = course.documents.filter(doc => doc._id.toString() !== documentId);
    await course.save();

    res.json({ 
      message: 'Document deleted successfully',
      documentId
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ 
      message: 'Error deleting document',
      error: error.message 
    });
  }
});

// Update video deletion route
router.delete('/:courseId/videos/:videoId', authMiddleware, async (req, res) => {
  try {
    const { courseId, videoId } = req.params;

    // Find the course
    const course = await Course.findOne({ id: courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the video
    const video = course.videos.find(v => v._id.toString() === videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Verify that the user is the course instructor
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can delete videos' });
    }

    // Delete the physical file
    const filePath = path.join(__dirname, '..', video.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove the video from the course
    course.videos = course.videos.filter(v => v._id.toString() !== videoId);
    await course.save();

    res.json({ 
      message: 'Video deleted successfully',
      videoId
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ 
      message: 'Error deleting video',
      error: error.message 
    });
  }
});

module.exports = router; 