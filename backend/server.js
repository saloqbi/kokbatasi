const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const signalsRoutes = require('./routes/signals');
const randomRoutes = require('./routes/randomRoutes');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// WebSocket broadcast
io.on('connection', (socket) => {
  console.log('✅ WebSocket client connected');
});

app.use(cors());
app.use(express.json());

// 🟢 REST API routes
app.use('/api/signals', signalsRoutes);

// ✅ مسار التوصيات العشوائية دون تعارض
app.use('/api/random', randomRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server + WebSocket running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// 💡 تصدير الـ io لاستخدامه في بث الإشارات من أي مكان
module.exports = { io };
