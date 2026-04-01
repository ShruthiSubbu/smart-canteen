// backend/routes/admin.js
const express    = require('express');
const router     = express.Router();
const MenuItem   = require('../models/MenuItem');
const Order      = require('../models/Order');
const Settings   = require('../models/Settings');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// ── HELPER: load canteen config from DB (with defaults) ──────────
async function getCanteenConfig() {
  const doc = await Settings.findOne({ key: 'canteenConfig' });
  if (doc) return doc.value;
  return {
    openTime:       '08:00',
    closeTime:      '21:00',
    closedDays:     [0],
    manualOverride: null
  };
}

// ── HELPER: 24h "HH:MM" → "12:00 AM/PM" ────────────────────────
function fmt12(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const ampm   = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

// ── HELPER: next open day label ──────────────────────────────────
function nextOpenLabel(config, now) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 1; i <= 7; i++) {
    const d = (now.getDay() + i) % 7;
    if (!config.closedDays.includes(d)) {
      return i === 1 ? 'tomorrow' : `on ${days[d]}`;
    }
  }
  return 'soon';
}

// ── GET /api/admin/canteen-status — PUBLIC (menu page + admin) ───
router.get('/canteen-status', async (req, res) => {
  try {
    const config = await getCanteenConfig();
    const now    = new Date();
    const day    = now.getDay();
    const hhmm   = now.toTimeString().slice(0, 5);

    // Manual override takes full priority
    if (config.manualOverride) {
      const isOpen = config.manualOverride === 'open';
      return res.json({
        isOpen,
        openTime:       config.openTime,
        closeTime:      config.closeTime,
        closedDays:     config.closedDays,
        manualOverride: config.manualOverride,
        message: isOpen
          ? `🟢 Canteen is OPEN (override) · Closes at ${fmt12(config.closeTime)}`
          : `🔴 Canteen is CLOSED (override) · Opens at ${fmt12(config.openTime)}`
      });
    }

    const isDayOff    = config.closedDays.includes(day);
    const afterOpen   = hhmm >= config.openTime;
    const beforeClose = hhmm <  config.closeTime;
    const isOpen      = !isDayOff && afterOpen && beforeClose;

    let message;
    if (isDayOff)       message = `🔴 Canteen is CLOSED today · Opens ${nextOpenLabel(config, now)} at ${fmt12(config.openTime)}`;
    else if (!afterOpen)  message = `🔴 Canteen is CLOSED · Opens today at ${fmt12(config.openTime)}`;
    else if (!beforeClose)message = `🔴 Canteen is CLOSED · Opens ${nextOpenLabel(config, now)} at ${fmt12(config.openTime)}`;
    else                  message = `🟢 Canteen is OPEN · Closes at ${fmt12(config.closeTime)}`;

    res.json({
      isOpen,
      openTime:       config.openTime,
      closeTime:      config.closeTime,
      closedDays:     config.closedDays,
      manualOverride: null,
      message
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/admin/canteen-timing — ADMIN ONLY ───────────────────
router.put('/canteen-timing', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { openTime, closeTime, closedDays, manualOverride } = req.body;

    // Load current config, merge changes
    const current = await getCanteenConfig();
    const updated = {
      openTime:       openTime       !== undefined ? openTime       : current.openTime,
      closeTime:      closeTime      !== undefined ? closeTime      : current.closeTime,
      closedDays:     closedDays     !== undefined ? closedDays     : current.closedDays,
      manualOverride: manualOverride !== undefined ? (manualOverride || null) : current.manualOverride
    };

    // Upsert into MongoDB
    await Settings.findOneAndUpdate(
      { key: 'canteenConfig' },
      { key: 'canteenConfig', value: updated },
      { upsert: true, new: true }
    );

    res.json({ message: 'Canteen timing updated!', config: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/admin/menu/add — ADMIN ONLY ────────────────────────
router.post('/menu/add', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, category, price, stockCount, description } = req.body;
    const item = new MenuItem({
      name, category, price,
      stock: stockCount, stockCount,
      description
    });
    await item.save();
    res.status(201).json({ message: 'Menu item added!', item });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── PUT /api/admin/menu/restock/:id — ADMIN ONLY ─────────────────
router.put('/menu/restock/:id', authMiddleware, adminMiddleware, async (req, res) => {
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

// ── GET /api/admin/menu — ADMIN ONLY ────────────────────────────
router.get('/menu', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── GET /api/admin/stats — ADMIN ONLY ───────────────────────────
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
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

// ── GET /api/admin/orders — ADMIN ONLY ──────────────────────────
router.get('/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── PUT /api/admin/menu/:id — ADMIN ONLY ────────────────────────
router.put('/menu/:id', authMiddleware, adminMiddleware, async (req, res) => {
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

// ── DELETE /api/admin/menu/:id — ADMIN ONLY ─────────────────────
router.delete('/menu/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;