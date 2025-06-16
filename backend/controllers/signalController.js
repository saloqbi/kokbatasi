const Signal = require('../models/signal');

// ✅ استرجاع جميع التوصيات
const getSignals = async (req, res) => {
  try {
    const signals = await Signal.find();
    res.json(signals);
  } catch (error) {
    console.error("❌ Error fetching signals:", error.message, error.stack);
    res.status(500).json({ message: "Failed to fetch signals", error: String(error) });
  }
};

// ✅ إنشاء توصية جديدة
const createSignal = async (req, res) => {
  try {
    const newSignal = new Signal(req.body);
    await newSignal.save();
    res.status(201).json(newSignal);
  } catch (error) {
    console.error("❌ Error creating signal:", error.message, error.stack);
    res.status(500).json({ message: "Failed to create signal", error: String(error) });
  }
};

// ✅ توليد توصيات عشوائية مع إظهار الخطأ النصي
const generateRandomSignals = async (req, res) => {
  try {
    const randomSignals = [];
    const actions = ['buy', 'sell'];
    const symbols = ['BTC', 'ETH', 'SP500', 'AAPL', 'TASI'];

    for (let i = 0; i < 5; i++) {
      const randomSignal = new Signal({
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        price: parseFloat((Math.random() * 500).toFixed(2)),
        lines: [],
        zones: [],
        fractals: [],
        waves: [],
      });
      await randomSignal.save();
      randomSignals.push(randomSignal);
    }

    res.status(201).json({
      message: "✅ Random signals generated",
      data: randomSignals
    });
  } catch (error) {
    console.error("❌ Error generating signals:", error.message, error.stack);
    res.status(500).json({
      message: "❌ Failed to generate random signals",
      error: String(error) // ✅ الخطأ يظهر مباشرة في المتصفح
    });
  }
};

// ✅ تحديث أدوات الرسم
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
    console.error("❌ Error updating drawings:", error.message, error.stack);
    res.status(500).json({ message: "Failed to update signal drawings", error: String(error) });
  }
};

module.exports = {
  getSignals,
  createSignal,
  generateRandomSignals,
  updateSignalDrawings,
};
