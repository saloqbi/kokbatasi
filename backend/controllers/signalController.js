const Signal = require('../models/signal');

const getSignals = async (req, res) => {
  try {
    console.log("🔍 Trying to fetch signals from database...");
    const signals = await Signal.find();
    console.log("✅ Signals fetched successfully:", signals.length);
    res.json(signals);
  } catch (error) {
    console.error("❌ Error fetching signals:", error.message);
    res.status(500).json({ message: "Failed to fetch signals" });
  }
};

const createSignal = async (req, res) => {
  try {
    const newSignal = new Signal(req.body);
    await newSignal.save();
    res.status(201).json(newSignal);
  } catch (error) {
    console.error("❌ Error creating signal:", error.message);
    res.status(500).json({ message: "Failed to create signal" });
  }
};

const generateRandomSignals = async (req, res) => {
  try {
    const randomSignals = [];
    const types = ['Buy', 'Sell'];
    const symbols = ['BTC', 'ETH', 'SP500', 'AAPL', 'TASI'];

    for (let i = 0; i < 5; i++) {
      const randomSignal = new Signal({
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        price: parseFloat((Math.random() * 500).toFixed(2)),
        type: types[Math.floor(Math.random() * types.length)],
        date: new Date().toISOString().split('T')[0],
        data: [],
      });
      await randomSignal.save();
      randomSignals.push(randomSignal);
    }

    res.status(201).json({ message: "Random signals generated", data: randomSignals });
  } catch (error) {
    console.error("❌ Error generating random signals:", error.message);
    res.status(500).json({ message: "Failed to generate random signals" });
  }
};

module.exports = {
  getSignals,
  createSignal,
  generateRandomSignals,
};
