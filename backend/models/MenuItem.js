// backend/models/MenuItem.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  stars:     { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Snacks', 'Beverages'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    default: 50
  },
  stockCount: {
    type: Number,
    default: 50
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  available: {
    type: Boolean,
    default: true
  },
  orderCount: {
    type: Number,
    default: 0
  },
  // ── Ratings ──────────────────────────────────────────────────
  ratings: {
    type: [ratingSchema],
    default: []
  },
  avgRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);