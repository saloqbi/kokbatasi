
const Signal = require('../models/signal');

const getSignals = async (req, res) => {
  const signals = await Signal.find().sort({ createdAt: -1 });
  res.json(signals);
};

const createSignal = async (req, res) => {
  const signal = new Signal(req.body);
  const saved = await signal.save();
  res.status(201).json(saved);
};

module.exports = { getSignals, createSignal };
