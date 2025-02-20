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
    rating: 4.8,
    enrolledCount: 2500,
    image: "/images/courses/banners/python-basics.png",
    price: 299.99,
    description: "Découvrez les fondamentaux de Python, le langage de programmation le plus populaire. Maîtrisez la syntaxe de base, les structures de données et les concepts essentiels de la programmation.",
    level: "Beginner",
    students: 2500,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "html-css-fundamentals",
    title: "HTML & CSS : Les Fondamentaux du Web",
    instructor: "Dr. Sarah Mansour",
    duration: 25,
    rating: 4.9,
    enrolledCount: 1800,
    image: "/images/courses/banners/html-css.jpg",
    price: 399.99,
    description: "Maîtrisez les bases du développement web avec HTML et CSS. Créez des sites web modernes, responsifs et professionnels. Un parcours complet pour devenir développeur web.",
    level: "Beginner",
    students: 1800,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'scratch-coding',
    title: 'Scratch Coding',
    description: 'Start your coding journey with Scratch. Perfect for beginners to learn programming concepts through visual blocks.',
    instructor: 'Prof. Maria Garcia',
    duration: '15 hours',
    category: 'Programming',
    level: 'Beginner',
    price: 79.99,
    students: 856,
    rating: 4.7,
    image: '/images/courses/scratch.jpg'
  },
  {
    id: 'microsoft-office',
    title: 'Microsoft Office',
    description: 'Master Microsoft Office suite including Word, Excel, and PowerPoint. Boost your productivity with essential office skills.',
    instructor: 'John Smith',
    duration: '30 hours',
    category: 'Office Skills',
    level: 'All Levels',
    price: 129.99,
    students: 2156,
    rating: 4.6,
    image: '/images/courses/office.jpg'
  }
];

// Function to seed initial courses
const seedInitialCourses = async () => {
  try {
    console.log('Checking for initial courses...');
    
    for (const courseData of initialCourses) {
      try {
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

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
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

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Handle application termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

startServer(); 