const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');

const signalRoutes = require('./routes/signals');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

// ✅ استخدم نفس الراوت لخدمتين مختلفتين
app.use('/api/signals', signalRoutes);       // الواجهة الأمامية
app.use('/webhook/signals', signalRoutes);   // استقبال Webhook

// ✅ اتصال MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// ✅ WebSocket
io.on('connection', (socket) => {
  console.log('🟢 WebSocket client connected');
  socket.on('disconnect', () => {
    console.log('🔴 WebSocket client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server + WebSocket running on port ${PORT}`);
});
