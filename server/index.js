require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const connectDB = require('./config/db');
const multer = require('multer');
const fs = require('fs');
const courseRoutes = require('./routes/courses'); // Import the course routes

// Verify the environment variable is loaded
console.log('MONGO_URI:', process.env.MONGO_URI ? 'exists' : 'missing');

const app = express();
const PORT = process.env.PORT || 5000;

// Add at the top of the file
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'], // Adjust this to your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes); // Register the course routes

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
      console.log('MongoDB connected successfully');
    } catch (dbError) {
      console.error('MongoDB connection error:', dbError);
      
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying database connection in ${RETRY_INTERVAL/1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
        return startServer(retryCount + 1);
      }
      throw dbError;
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
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

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

startServer(); 