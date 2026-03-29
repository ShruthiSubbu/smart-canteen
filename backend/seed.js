// seed.js — Run with: node backend/seed.js
// Seeds 12 menu items into MongoDB Atlas

const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/smartcanteen';

const MenuItemSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  category:    { type: String, enum: ['Breakfast', 'Lunch', 'Snacks', 'Beverages'], required: true },
  description: { type: String },
  stock:       { type: Number, default: 50 },
  orderCount:  { type: Number, default: 0 },
  available:   { type: Boolean, default: true },
  imageUrl:    { type: String }
});

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

const menuItems = [
  // ── BREAKFAST (3) ──────────────────────────────────────────────
  {
    name: 'Masala Dosa',
    price: 40,
    category: 'Breakfast',
    description: 'Crispy rice crepe with spiced potato filling, served with sambar & chutneys',
    stock: 60,
    orderCount: 42,
    available: true
  },
  {
    name: 'Idli Sambar (2 pcs)',
    price: 30,
    category: 'Breakfast',
    description: 'Soft steamed rice cakes with hot sambar and coconut chutney',
    stock: 80,
    orderCount: 55,
    available: true
  },
  {
    name: 'Poha',
    price: 25,
    category: 'Breakfast',
    description: 'Flattened rice with onions, mustard seeds, peanuts & curry leaves',
    stock: 40,
    orderCount: 28,
    available: true
  },

  // ── LUNCH (3) ──────────────────────────────────────────────────
  {
    name: 'Veg Meals',
    price: 70,
    category: 'Lunch',
    description: 'Full South Indian thali — rice, sambar, rasam, 2 curries, pickle & papad',
    stock: 50,
    orderCount: 63,
    available: true
  },
  {
    name: 'Chicken Biryani',
    price: 90,
    category: 'Lunch',
    description: 'Fragrant basmati rice cooked with tender chicken, served with raita',
    stock: 35,
    orderCount: 71,
    available: true
  },
  {
    name: 'Paneer Fried Rice',
    price: 75,
    category: 'Lunch',
    description: 'Wok-tossed rice with paneer, veggies & Indo-Chinese sauces',
    stock: 30,
    orderCount: 39,
    available: true
  },

  // ── SNACKS (3) ─────────────────────────────────────────────────
  {
    name: 'Vada Pav',
    price: 20,
    category: 'Snacks',
    description: 'Mumbai-style spiced potato fritter in a soft bun with chutneys',
    stock: 60,
    orderCount: 88,
    available: true
  },
  {
    name: 'Samosa (2 pcs)',
    price: 15,
    category: 'Snacks',
    description: 'Crispy pastry filled with spiced potato and peas',
    stock: 70,
    orderCount: 76,
    available: true
  },
  {
    name: 'Pav Bhaji',
    price: 50,
    category: 'Snacks',
    description: 'Buttery spiced vegetable mash served with toasted pav buns',
    stock: 25,
    orderCount: 47,
    available: true
  },

  // ── BEVERAGES (3) ──────────────────────────────────────────────
  {
    name: 'Masala Chai',
    price: 15,
    category: 'Beverages',
    description: 'Freshly brewed spiced milk tea with ginger & cardamom',
    stock: 100,
    orderCount: 120,
    available: true
  },
  {
    name: 'Filter Coffee',
    price: 20,
    category: 'Beverages',
    description: 'Classic South Indian decoction coffee with frothy milk',
    stock: 80,
    orderCount: 95,
    available: true
  },
  {
    name: 'Mango Lassi',
    price: 35,
    category: 'Beverages',
    description: 'Thick chilled yoghurt drink blended with Alphonso mango pulp',
    stock: 45,
    orderCount: 34,
    available: true
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    // Clear existing items
    const deleted = await MenuItem.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing menu items.`);

    // Insert fresh items
    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`\n✅ Seeded ${inserted.length} menu items:\n`);

    inserted.forEach((item, i) => {
      console.log(`  ${i + 1}. [${item.category}] ${item.name} — ₹${item.price} (stock: ${item.stock})`);
    });

    console.log('\nDone! Disconnecting...');
    await mongoose.disconnect();
    console.log('Disconnected. Seed complete 🎉');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();