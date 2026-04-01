// backend/routes/menu.js
const express = require('express');
const router  = express.Router();
const MenuItem = require('../models/MenuItem');
const Order    = require('../models/Order');
const { authMiddleware } = require('../middleware/auth');

// ── GET / — all menu items ───────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ orderCount: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── POST /add — add menu item ────────────────────────────────────
router.post('/add', async (req, res) => {
  try {
    const { name, category, price, stockCount } = req.body;
    const item = new MenuItem({ name, category, price, stockCount });
    await item.save();
    res.status(201).json({ message: 'Menu item added!', item });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── POST /:id/rate — student rates an item ───────────────────────
// Rules:
//   1. Must be logged in
//   2. Must have ordered this item at least once (any completed/ready order)
//   3. One rating per student per item — resubmitting updates existing rating
router.post('/:id/rate', authMiddleware, async (req, res) => {
  try {
    const { stars, comment } = req.body;
    const userId = req.user.userId.toString();

    // Validate stars
    const starsNum = Number(stars);
    if (!starsNum || starsNum < 1 || starsNum > 5) {
      return res.status(400).json({ message: 'Stars must be between 1 and 5' });
    }

    // Check item exists
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });

    // Check student has ordered this item
    const orderedBefore = await Order.findOne({
      userId,
      'items.menuItemId': req.params.id
    });
    if (!orderedBefore) {
      return res.status(403).json({ message: 'You can only rate items you have ordered' });
    }

    // Check if student already rated — update existing, else push new
    const existingIdx = item.ratings.findIndex(r => r.userId === userId);
    if (existingIdx !== -1) {
      item.ratings[existingIdx].stars   = starsNum;
      item.ratings[existingIdx].comment = comment || '';
      item.ratings[existingIdx].createdAt = new Date();
    } else {
      item.ratings.push({ userId, stars: starsNum, comment: comment || '' });
    }

    // Recompute avgRating and totalRatings
    item.totalRatings = item.ratings.length;
    item.avgRating    = parseFloat(
      (item.ratings.reduce((sum, r) => sum + r.stars, 0) / item.totalRatings).toFixed(1)
    );

    await item.save();

    res.json({
      message:      'Rating submitted!',
      avgRating:    item.avgRating,
      totalRatings: item.totalRatings
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;