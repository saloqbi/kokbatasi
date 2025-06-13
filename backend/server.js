
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server: WebSocketServer } = require('ws');

const signalsRoutes = require('./routes/signals');
const randomRoutes = require('./routes/randomRoutes');
const { registerWebSocketServer } = require('./utils/socket');

dotenv.config();

const app = express(); // ✅ يجب أن يُعرف أولاً
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// ✅ WebSocket registration
registerWebSocketServer(wss);

// ✅ المسارات بعد تعريف app
app.use('/api/signals', signalsRoutes);
app.use('/api/signals', randomRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
  server.listen(port, () => {
    console.log(`🚀 Server + WebSocket running on port ${port}`);
  });
}).catch(err => console.error(err));
