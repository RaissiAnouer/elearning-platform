const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function updateUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all users without phone
    const result = await User.updateMany(
      { phone: { $exists: false } },
      { $set: { phone: "Not provided" } }
    );

    console.log(`Updated ${result.modifiedCount} users`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateUsers(); 