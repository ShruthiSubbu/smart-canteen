const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

// ADD MENU ITEM
router.post('/menu/add', async (req, res) => {
  try {
    const { name, category, price, stockCount } = req.body;
    const item = new MenuItem({ name, category, price, stockCount });
    await item.save();
    res.status(201).json({ message: 'Menu item added!', item });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// RESTOCK MENU ITEM
router.put('/menu/restock/:id', async (req, res) => {
  try {
    const { stockCount } = req.body;
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { stockCount, isAvailable: true },
      { new: true }
    );
    res.json({ message: 'Stock updated!', item });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET ALL MENU ITEMS (for admin)
router.get('/menu', async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET DASHBOARD STATS
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const totalRevenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = totalRevenueData[0]?.total || 0;
    const totalItems = await MenuItem.countDocuments();
    res.json({ totalOrders, pendingOrders, totalRevenue, totalItems });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET ALL ORDERS (admin)
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── EDIT MENU ITEM ───────────────────────────────────────────────
router.put('/menu/:id', async (req, res) => {
  try {
    const { name, category, price, stockCount, description, available } = req.body;
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (name        !== undefined) item.name        = name;
    if (category    !== undefined) item.category    = category;
    if (price       !== undefined) item.price       = Number(price);
    if (stockCount  !== undefined) item.stock       = Number(stockCount);
    if (description !== undefined) item.description = description;
    if (available   !== undefined) item.available   = available;

    await item.save();
    res.json({ message: 'Item updated', item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE MENU ITEM ─────────────────────────────────────────────
router.delete('/menu/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;