const Signal = require('../models/signal');

// ✅ Get all signals
const getSignals = async (req, res) => {
  try {
    const signals = await Signal.find().sort({ createdAt: -1 });
    console.log('✅ Signals fetched:', signals.length); // للتأكيد
    res.json(signals);
  } catch (error) {
    console.error('❌ Error fetching signals:', error.message);
    res.status(500).json({ message: 'Failed to fetch signals' });
  }
};

// ✅ Create a new signal
const createSignal = async (req, res) => {
  try {
    const signal = new Signal(req.body);
    const saved = await signal.save();
    console.log('✅ New signal saved:', saved._id);
    res.status(201).json(saved);
  } catch (error) {
    console.error('❌ Error creating signal:', error.message);
    res.status(500).json({ message: 'Failed to create signal' });
  }
};

module.exports = { getSignals, createSignal };
