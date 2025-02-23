require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const courseRoutes = require('./routes/courses');
const Course = require('./models/Course');
const connectDB = require('./config/db');
const multer = require('multer');
const fs = require('fs');

// Verify the environment variable is loaded
console.log('MONGO_URI:', process.env.MONGO_URI ? 'exists' : 'missing');

const app = express();
const PORT = process.env.PORT || 5000;

// Initial courses data
const initialCourses = [
  {
    id: "python-for-beginners",
    title: "Python pour Débutants : De Zéro à Héros",
    instructor: "Dr. Ahmed Ben Ali",
    duration: 20,
    enrolledCount: 2500,
    image: "/images/courses/banners/python-basics.png",
    price: 299.99,
    description: "Découvrez les fondamentaux de Python, le langage de programmation le plus populaire. Maîtrisez la syntaxe de base, les structures de données et les concepts essentiels de la programmation.",
    category: "Programming",
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "html-css-fundamentals",
    title: "HTML & CSS : Les Fondamentaux du Web",
    instructor: "Dr. Sarah Mansour",
    duration: 25,
    enrolledCount: 1800,
    image: "/images/courses/banners/html-css.jpg",
    price: 399.99,
    description: "Maîtrisez les bases du développement web avec HTML et CSS. Créez des sites web modernes, responsifs et professionnels. Un parcours complet pour devenir développeur web.",
    category: "Web Development",
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Add at the top of the file
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

// Function to seed initial courses
const seedInitialCourses = async () => {
  try {
    console.log('Checking for initial courses...');
    
    for (const courseData of initialCourses) {
      try {
        // Ensure duration is a number
        if (typeof courseData.duration === 'string') {
          courseData.duration = parseInt(courseData.duration);
        }

        const existingCourse = await Course.findOne({ id: courseData.id });
        if (!existingCourse) {
          const course = await Course.create(courseData);
          console.log(`Created course: ${course.title}`);
        } else {
          console.log(`Course already exists: ${courseData.title}`);
        }
      } catch (courseError) {
        console.error(`Error creating course ${courseData.title}:`, courseError.message);
        if (courseError.errors) {
          Object.keys(courseError.errors).forEach(key => {
            console.error(`- ${key}: ${courseError.errors[key].message}`);
          });
        }
      }
    }
    
    console.log('Initial courses check completed');
  } catch (error) {
    console.error('Error seeding initial courses:', error.message);
  }
};

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make Mongoose available to routes
app.set('mongoose', mongoose);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request Body:', req.body);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);

// Add error handling for file uploads
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File is too large. Maximum size is 500MB' 
      });
    }
    return res.status(400).json({ 
      message: 'File upload error', 
      error: err.message 
    });
  }
  next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// Handle 404s
app.use((req, res) => {
  console.log('404 for URL:', req.url);
  res.status(404).json({ message: 'Route not found' });
});

// Initialize upload directories
const initializeUploadDirs = () => {
  const dirs = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'uploads/videos'),
    path.join(__dirname, 'uploads/documents')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Modify the startServer function
const startServer = async (retryCount = 0) => {
  try {
    // Initialize upload directories
    initializeUploadDirs();
    
    // Connect to MongoDB with retry logic
    try {
      await connectDB();
    } catch (dbError) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying database connection in ${RETRY_INTERVAL/1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
        return startServer(retryCount + 1);
      }
      throw dbError;
    }
    
    // Seed initial courses
    await seedInitialCourses();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

// Add graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
});

startServer(); 