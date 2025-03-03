const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  grade: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for email and username
userSchema.index({ email: 1, username: 1 });

// Add pre-save middleware to ensure name is set
userSchema.pre('save', function(next) {
  if (!this.name) {
    this.name = this.username;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
