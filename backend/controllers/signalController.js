
const signal = require('../models/signal');

// ✅ استيراد دالة البث من الخادم

const { broadcastNewSignal } = require('../utils/socket');

const getsignals = async (req, res) => {
  const signals = await signal.find().sort({ createdAt: -1 });
  res.json(signals);
};

const createsignal = async (req, res) => {
  const signal = new signal(req.body);
  const saved = await signal.save();
  broadcastNewSignal(saved); // ✅ بث الإشارة الجديدة عبر WebSocket
  res.status(201).json(saved);
};

module.exports = { getsignals, createSignal };
