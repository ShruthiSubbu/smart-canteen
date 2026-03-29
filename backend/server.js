const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ── Serve frontend static files ──────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend')));

const authRoutes  = require('./routes/auth');
const menuRoutes  = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

app.use('/api/auth',   authRoutes);
app.use('/api/menu',   menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin',  adminRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log('❌ Connection failed:', err.message);
  });