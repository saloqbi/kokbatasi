
const Signal = require('../models/signal');

// ✅ استيراد دالة البث من الخادم

const { broadcastNewSignal } = require('../utils/socket');

const getSignals = async (req, res) => {
  const signals = await Signal.find().sort({ createdAt: -1 });
  res.json(signals);
};

const createSignal = async (req, res) => {
  const signal = new Signal(req.body);
  const saved = await signal.save();
  broadcastNewSignal(saved); // ✅ بث الإشارة الجديدة عبر WebSocket
  res.status(201).json(saved);
};

module.exports = { getSignals, createSignal };
