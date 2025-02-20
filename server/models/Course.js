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
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'All Levels',
    get: function(level) {
      const translations = {
        'Beginner': 'Débutant',
        'Intermediate': 'Intermédiaire',
        'Advanced': 'Avancé',
        'All Levels': 'Tous Niveaux'
      };
      return translations[level] || level;
    }
  },
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  students: {
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
  }
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
