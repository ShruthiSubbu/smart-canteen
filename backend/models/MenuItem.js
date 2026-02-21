const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['breakfast', 'lunch', 'snacks', 'beverages'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stockCount: {
    type: Number,
    default: 50
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  orderCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);