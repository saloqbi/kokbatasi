const Signal = require('../models/signal');

// ✅ استرجاع جميع التوصيات
const getSignals = async (req, res) => {
  try {
    const signals = await Signal.find();
    res.json(signals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch signals" });
  }
};

// ✅ إنشاء توصية جديدة
const createSignal = async (req, res) => {
  try {
    const newSignal = new Signal(req.body);
    await newSignal.save();
    res.status(201).json(newSignal);
  } catch (error) {
    res.status(500).json({ message: "Failed to create signal" });
  }
};

// ✅ توليد توصيات عشوائية
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
    res.status(500).json({ message: "Failed to generate random signals" });
  }
};

// ✅ تحديث أدوات الرسم (خطوط، مناطق، فراكتل، موجات إليوت)
const updateSignalDrawings = async (req, res) => {
  try {
    const { lines, zones, fractals, waves } = req.body;
    const signal = await Signal.findByIdAndUpdate(
      req.params.id,
      { lines, zones, fractals, waves },
      { new: true }
    );
    if (!signal) return res.status(404).json({ message: "Signal not found" });
    res.json(signal);
  } catch (error) {
    res.status(500).json({ message: "Failed to update signal drawings" });
  }
};

module.exports = {
  getSignals,
  createSignal,
  generateRandomSignals,
  updateSignalDrawings,
};
//