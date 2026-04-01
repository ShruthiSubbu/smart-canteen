const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');
const path     = require('path');
const http     = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app    = express();
const server = http.createServer(app);  // wrap express in http server
const io     = new Server(server, {
  cors: { origin: '*' }                 // allow all origins (localhost is fine)
});

app.use(cors());
app.use(express.json());

// ── Serve frontend static files ──────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend')));

// ── Attach io to every request so routes can emit events ─────────
app.use((req, res, next) => {
  req.io = io;
  next();
});

const authRoutes  = require('./routes/auth');
const menuRoutes  = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

app.use('/api/auth',   authRoutes);
app.use('/api/menu',   menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin',  adminRoutes);

// ── Socket.io connection log ──────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    server.listen(PORT, () => {        // use server.listen, NOT app.listen
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log('❌ Connection failed:', err.message);
  });