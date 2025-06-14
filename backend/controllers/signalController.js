const Signal = require('../models/signal');

// ✅ Get all signals
const getSignals = async (req, res) => {
  try {
    console.log("🔍 Fetching signals...");
    const signals = await Signal.find();
    console.log("✅ Signals fetched:", signals);
    res.json(signals);
  } catch (error) {
    console.error("❌ Failed to fetch signals:", error.message);
    res.status(500).json({ message: "Failed to fetch signals" });
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
