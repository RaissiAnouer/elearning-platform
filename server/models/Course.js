const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  id: String,
  title: String,
  duration: Number,
  content: String,
  order: Number,
  videoUrl: String,
  resources: [String]
});

const documentSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    default: 'Uncategorized'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const videoSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const courseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[a-z0-9-]+$/.test(v);
      },
      message: props => `${props.value} is not a valid course ID format!`
    }
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  image: String,
  thumbnail: String,
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  lessons: [lessonSchema],
  objectives: [String],
  requirements: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  videos: [videoSchema],
  documents: [documentSchema]
});

// Pre-save middleware to generate ID if not provided
courseSchema.pre('save', function(next) {
  if (!this.id) {
    this.id = this.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
