require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');

async function updateCoursesSchema() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all courses
    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses to update`);

    // Update each course
    for (const course of courses) {
      console.log(`\nProcessing course: ${course.title}`);
      
      try {
        // Initialize documents array if it doesn't exist
        if (!course.documents) {
          console.log('- Initializing empty documents array');
          course.documents = [];
        }

        // Convert any string documents to proper objects
        if (Array.isArray(course.documents)) {
          console.log('- Converting documents to proper schema');
          course.documents = course.documents.map(doc => {
            if (typeof doc === 'string') {
              console.log(`  Converting string document: ${doc}`);
              return {
                title: 'Untitled Document',
                url: doc,
                type: 'UNKNOWN',
                size: '0 MB',
                createdAt: new Date()
              };
            }
            return doc;
          });
        }

        // Initialize videos array if it doesn't exist
        if (!course.videos) {
          console.log('- Initializing empty videos array');
          course.videos = [];
        }

        // Convert any string videos to proper objects
        if (Array.isArray(course.videos)) {
          console.log('- Converting videos to proper schema');
          course.videos = course.videos.map(video => {
            if (typeof video === 'string') {
              console.log(`  Converting string video: ${video}`);
              return {
                title: 'Untitled Video',
                url: video,
                duration: '0:00',
                createdAt: new Date()
              };
            }
            return video;
          });
        }

        // Save the updated course
        await course.save();
        console.log(`✓ Successfully updated course: ${course.title}`);
      } catch (courseError) {
        console.error(`Error updating course ${course.title}:`, courseError);
        console.error('Course data:', JSON.stringify(course, null, 2));
      }
    }

    console.log('\nAll courses processed');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('Error updating courses:', error);
    if (error.codeName) {
      console.error('MongoDB error code:', error.codeName);
    }
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Add error handler for unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

updateCoursesSchema();