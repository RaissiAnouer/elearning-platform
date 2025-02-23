const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Remove deprecated options
      // useNewUrlParser: true, // deprecated
      // useUnifiedTopology: true, // deprecated
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      retryWrites: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Force IPv4
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Test the connection
    const testDoc = await mongoose.connection.db.collection('courses').findOne({});
    console.log('Database connection test:', testDoc ? 'successful' : 'no documents found');
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Add more detailed error logging
    if (error.name === 'MongoServerSelectionError') {
      console.error('Failed to connect to MongoDB cluster:', {
        name: error.name,
        message: error.message,
        reason: error.reason,
        code: error.code
      });
    }
    process.exit(1);
  }
};

// Add connection event handlers
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

module.exports = connectDB; 