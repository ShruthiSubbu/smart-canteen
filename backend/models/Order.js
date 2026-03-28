// backend/models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },

  items: [{
    menuItemId: { type: String },
    name:       { type: String, required: true },
    price:      { type: Number, required: true },
    quantity:   { type: Number, required: true }
  }],

  total:      { type: Number, required: true },
  pickupTime: { type: String },

  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
    default: 'Pending'
  },

  // Full audit trail of every status change
  statusHistory: [{
    status:    { type: String },
    changedAt: { type: Date, default: Date.now }
  }]

}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);