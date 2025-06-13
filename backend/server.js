
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server: WebSocketServer } = require('ws');
const signalsRoutes = require('./routes/signals');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let clients = [];

wss.on('connection', (ws) => {
  console.log('🔌 WebSocket client connected');
  clients.push(ws);

  ws.on('close', () => {
    console.log('❌ WebSocket client disconnected');
    clients = clients.filter(client => client !== ws);
  });
});

// بث الإشارة الجديدة لجميع العملاء
function broadcastNewSignal(signal) {
  const data = JSON.stringify({ type: 'new_signal', payload: signal });
  clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
}

app.use('/api/signals', signalsRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
  server.listen(port, () => {
    console.log(`🚀 Server + WebSocket running on port ${port}`);
  });
}).catch(err => console.error(err));

module.exports = { broadcastNewSignal };
