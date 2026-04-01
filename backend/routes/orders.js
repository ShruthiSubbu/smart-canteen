// backend/routes/orders.js
const express = require('express');
const router  = express.Router();
const Order    = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// ── POST / — place a new order ───────────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, pickupTime } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'No items in order' });

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) return res.status(404).json({ message: `Item ${item.menuItemId} not found` });

      const stock = menuItem.stock ?? menuItem.stockCount ?? 0;
      if (stock < item.quantity) return res.status(400).json({ message: `${menuItem.name} is out of stock` });

      menuItem.stock      = stock - item.quantity;
      menuItem.stockCount = stock - item.quantity;
      menuItem.orderCount += item.quantity;
      await menuItem.save();

      total += menuItem.price * item.quantity;
      orderItems.push({
        menuItemId: item.menuItemId,
        name:       menuItem.name,
        price:      menuItem.price,
        quantity:   item.quantity
      });
    }

    const order = new Order({
      userId:   req.user.userId.toString(),
      items:    orderItems,
      total,
      pickupTime,
      status:   'Pending',
      statusHistory: [{ status: 'Pending', changedAt: new Date() }]
    });

    await order.save();

    // ── Emit new order event so admin dashboard updates live ──
    req.io.emit('newOrder', order);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /my — student's own orders ──────────────────────────────
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId.toString() }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /rush-status — public ────────────────────────────────────
router.get('/rush-status', async (req, res) => {
  try {
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentCount = await Order.countDocuments({ createdAt: { $gte: fifteenMinsAgo } });
    res.json({ isRush: recentCount >= 10, count: recentCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET / — admin: all orders ────────────────────────────────────
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /:id — single order ──────────────────────────────────────
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId !== req.user.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PATCH /:id/status — admin updates status ─────────────────────
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending','Preparing','Ready','Completed','Cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({ status, changedAt: new Date() });
    await order.save();

    // ── Emit to ALL connected clients ─────────────────────────
    // Students filter by their own userId on the frontend
    req.io.emit('orderStatusUpdated', {
      orderId:  order._id.toString(),
      userId:   order.userId,
      status:   order.status,
      statusHistory: order.statusHistory
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;