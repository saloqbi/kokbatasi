const Signal = require('../models/signal');
const mongoose = require("mongoose");

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

// ✅ إنشاء توصية جديدة (مع الشموع)
const createSignal = async (req, res) => {
  try {
    const {
      symbol,
      action,
      price,
      lines,
      zones,
      fractals,
      waves,
      data
    } = req.body;

    const newSignal = new Signal({
      symbol,
      action,
      price,
      lines: lines || [],
      zones: zones || [],
      fractals: fractals || [],
      waves: waves || [],
      data: data || []
    });

    const savedSignal = await newSignal.save();
    res.status(201).json(savedSignal);
  } catch (error) {
    console.error("❌ Error creating signal:", error.message, error.stack);
    res.status(500).json({ message: "Failed to create signal", error: String(error) });
  }
};

// ✅ توليد توصيات وهمية عشوائية
const generateRandomSignals = async (req, res) => {
  console.log("🔄 دخلنا على الدالة generateRandomSignals");

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
        data: []
      });
      await randomSignal.save();
      randomSignals.push(randomSignal);
    }

    console.log("✅ تم إنشاء التوصيات:", randomSignals.length);
    res.status(201).json({ message: "✅ Random signals generated", data: randomSignals });
  } catch (error) {
    console.error("❌ Error generating signals:", error.message, error.stack);
    res.status(500).json({ message: "❌ Failed to generate random signals", error: String(error) });
  }
};

// ✅ تحديث أدوات الرسم (مع التحقق من ObjectId)
const updateSignalDrawings = async (req, res) => {
  const signalId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(signalId)) {
    return res.status(400).json({ message: "Invalid signal ID" });
  }

  try {
    const { lines, zones, fractals, waves } = req.body;
    const signal = await Signal.findByIdAndUpdate(
      signalId,
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
  updateSignalDrawings
};
