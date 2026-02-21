const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

router.post('/place', async (req, res) => {
  try {
    const { userId, items } = req.body;
    let totalPrice = 0;
    for (let item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ message: `${item.name} is not available` });
      }
      totalPrice += menuItem.price * item.quantity;
      menuItem.stockCount -= item.quantity;
      menuItem.orderCount += item.quantity;
      if (menuItem.stockCount <= 0) {
        menuItem.isAvailable = false;
      }
      await menuItem.save();
    }
    const order = new Order({ userId, items, totalPrice, status: 'pending' });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/rush-status', async (req, res) => {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: fifteenMinutesAgo }
    });
    const isRush = recentOrders > 10;
    res.json({ isRush, orderCount: recentOrders });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// UPDATE ORDER STATUS (admin)
router.put('/status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: 'Status updated!', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
module.exports = router;
