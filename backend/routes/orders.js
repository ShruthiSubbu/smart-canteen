// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// ── POST /orders — place a new order ────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, pickupTime } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'No items in order' });

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) return res.status(404).json({ message: `Item ${item.menuItemId} not found` });
      if (menuItem.stock < item.quantity) return res.status(400).json({ message: `${menuItem.name} is out of stock` });

      menuItem.stock -= item.quantity;
      menuItem.orderCount += item.quantity;
      await menuItem.save();

      total += menuItem.price * item.quantity;
      orderItems.push({ menuItemId: item.menuItemId, name: menuItem.name, price: menuItem.price, quantity: item.quantity });
    }

    const order = new Order({
      userId: req.user.id.toString(),
      items: orderItems,
      total,
      pickupTime,
      status: 'Pending',
      statusHistory: [{ status: 'Pending', changedAt: new Date() }]
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /orders/my — student's own orders ───────────────────────
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id.toString() }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /orders — admin: all orders ─────────────────────────────
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /orders/:id — single order (for polling) ────────────────
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PATCH /orders/:id/status — admin updates status ─────────────
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({ status, changedAt: new Date() });
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
  router.get('/my', authMiddleware, async (req, res) => {
  try {
    console.log('req.user:', req.user); // ADD THIS LINE
    const orders = await Order.find({ userId: req.user.id.toString() }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.log('ERROR:', err.message); // ADD THIS LINE
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;