const express = require("express");
const router = express.Router();
const Signal = require("../models/signal");

// ✅ مسار إدخال توصية افتراضية للتجربة
router.get("/seed", async (req, res) => {
  try {
    const signal = new Signal({
      symbol: "AAPL",
      action: "buy",
      lines: [
        { x1: 1, y1: 100, x2: 5, y2: 120 }
      ],
      zones: [
        { x: 2, y: 90, width: 3, height: 10 }
      ]
    });
    await signal.save();
    res.json({ message: "تم إدخال التوصية بنجاح ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server error أثناء الإدخال ❌" });
  }
});

// ✅ مسار جلب كل التوصيات
router.get("/", async (req, res) => {
  try {
    const signals = await Signal.find().sort({ createdAt: -1 });
    res.json(signals);
  } catch (err) {
    res.status(500).json({ message: "Server error أثناء جلب التوصيات ❌" });
  }
});

// ✅ مسار جلب توصية واحدة
router.get("/:id", async (req, res) => {
  try {
    const signal = await Signal.findById(req.params.id);
    if (!signal) return res.status(404).json({ message: "Not found" });
    res.json(signal);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
