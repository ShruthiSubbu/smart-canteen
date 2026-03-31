const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

// ── CANTEEN TIMING (in-memory, resets on server restart) ─────────
// Default: 8:00 AM – 9:00 PM, closed on Sundays
let canteenConfig = {
  openTime:       '08:00',
  closeTime:      '21:00',
  closedDays:     [0],       // 0=Sun, 1=Mon … 6=Sat
  manualOverride: null       // null | 'open' | 'closed'
};

function fmt12(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function nextOpenLabel(config, now) {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  for (let i = 1; i <= 7; i++) {
    const d = (now.getDay() + i) % 7;
    if (!config.closedDays.includes(d)) {
      return i === 1 ? 'tomorrow' : `on ${days[d]}`;
    }
  }
  return 'soon';
}

// GET /api/admin/canteen-status — public, called by menu + orders pages
router.get('/canteen-status', (req, res) => {
  const now   = new Date();
  const day   = now.getDay();
  const hhmm  = now.toTimeString().slice(0, 5);

  // Manual override takes priority
  if (canteenConfig.manualOverride) {
    const isOpen = canteenConfig.manualOverride === 'open';
    return res.json({
      isOpen,
      openTime:       canteenConfig.openTime,
      closeTime:      canteenConfig.closeTime,
      closedDays:     canteenConfig.closedDays,
      manualOverride: canteenConfig.manualOverride,
      message: isOpen
        ? `🟢 Canteen is OPEN (override) · Closes at ${fmt12(canteenConfig.closeTime)}`
        : `🔴 Canteen is CLOSED (override) · Opens at ${fmt12(canteenConfig.openTime)}`
    });
  }

  const isDayOff   = canteenConfig.closedDays.includes(day);
  const afterOpen  = hhmm >= canteenConfig.openTime;
  const beforeClose = hhmm < canteenConfig.closeTime;
  const isOpen     = !isDayOff && afterOpen && beforeClose;

  let message;
  if (isDayOff) {
    message = `🔴 Canteen is CLOSED today · Opens ${nextOpenLabel(canteenConfig, now)} at ${fmt12(canteenConfig.openTime)}`;
  } else if (!afterOpen) {
    message = `🔴 Canteen is CLOSED · Opens today at ${fmt12(canteenConfig.openTime)}`;
  } else if (!beforeClose) {
    message = `🔴 Canteen is CLOSED · Opens ${nextOpenLabel(canteenConfig, now)} at ${fmt12(canteenConfig.openTime)}`;
  } else {
    message = `🟢 Canteen is OPEN · Closes at ${fmt12(canteenConfig.closeTime)}`;
  }

  res.json({
    isOpen,
    openTime:       canteenConfig.openTime,
    closeTime:      canteenConfig.closeTime,
    closedDays:     canteenConfig.closedDays,
    manualOverride: null,
    message
  });
});

// PUT /api/admin/canteen-timing — admin saves timing settings
router.put('/canteen-timing', (req, res) => {
  const { openTime, closeTime, closedDays, manualOverride } = req.body;
  if (openTime   !== undefined) canteenConfig.openTime       = openTime;
  if (closeTime  !== undefined) canteenConfig.closeTime      = closeTime;
  if (closedDays !== undefined) canteenConfig.closedDays     = closedDays;
  if (manualOverride !== undefined) canteenConfig.manualOverride = manualOverride || null;
  res.json({ message: 'Canteen timing updated!', config: canteenConfig });
});

// ── MENU ITEM ROUTES ─────────────────────────────────────────────

// ADD MENU ITEM
router.post('/menu/add', async (req, res) => {
  try {
    const { name, category, price, stockCount, description } = req.body;
    const item = new MenuItem({ name, category, price, stock: stockCount, stockCount, description });
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
      { stock: stockCount, stockCount, isAvailable: true, available: true },
      { new: true }
    );
    res.json({ message: 'Stock updated!', item });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET ALL MENU ITEMS
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
    const totalOrders      = await Order.countDocuments();
    const pendingOrders    = await Order.countDocuments({ status: 'Pending' });
    const totalRevenueData = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]);
    const totalRevenue     = totalRevenueData[0]?.total || 0;
    const totalItems       = await MenuItem.countDocuments();
    res.json({ totalOrders, pendingOrders, totalRevenue, totalItems });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET ALL ORDERS
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// EDIT MENU ITEM
router.put('/menu/:id', async (req, res) => {
  try {
    const { name, category, price, stockCount, description, available } = req.body;
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (name        !== undefined) item.name        = name;
    if (category    !== undefined) item.category    = category;
    if (price       !== undefined) item.price       = Number(price);
    if (stockCount  !== undefined) { item.stock = Number(stockCount); item.stockCount = Number(stockCount); }
    if (description !== undefined) item.description = description;
    if (available   !== undefined) { item.available = available; item.isAvailable = available; }
    await item.save();
    res.json({ message: 'Item updated', item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE MENU ITEM
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