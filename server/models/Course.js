const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String, // URL or path to the uploaded file
  },
  modules: {
    type: Array,
    default: []
  },
  pricingModel: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: function() { return this.pricingModel !== 'free'; }
  },
  discount: {
    type: Number,
    default: 0
  },
  enrollmentLimit: {
    type: Number,
    default: 0
  },
  certificate: {
    type: Boolean,
    default: false
  },
  seoTitle: {
    type: String,
  },
  seoDescription: {
    type: String,
  },
  keywords: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema); 