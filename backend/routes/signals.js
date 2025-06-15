
const express = require("express");
const router = express.Router();
const Signal = require("../models/Signal");

// ✅ جلب توصية واحدة
router.get("/:id", async (req, res) => {
  try {
    const signal = await Signal.findById(req.params.id);
    if (!signal) return res.status(404).json({ message: "Not found" });
    res.json(signal);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ حفظ الخطوط
router.put("/:id/lines", async (req, res) => {
  try {
    const { lines } = req.body;
    const signal = await Signal.findByIdAndUpdate(
      req.params.id,
      { lines },
      { new: true }
    );
    res.json(signal);
  } catch (err) {
    res.status(500).json({ message: "خطأ في حفظ الخطوط" });
  }
});

// ✅ حفظ المناطق
router.put("/:id/zones", async (req, res) => {
  try {
    const { zones } = req.body;
    const signal = await Signal.findByIdAndUpdate(
      req.params.id,
      { zones },
      { new: true }
    );
    res.json(signal);
  } catch (err) {
    res.status(500).json({ message: "خطأ في حفظ المناطق" });
  }
});

// ✅ مسار مؤقت لإدخال توصية تجريبية
router.post("/seed", async (req, res) => {
  try {
    const newSignal = await Signal.create({
      _id: "664dc95e362d3b1d6f69d8cc",
      symbol: "BTCUSDT",
      action: "buy",
      lines: [],
      zones: []
    });
    res.json({ message: "✅ توصية تجريبية أُضيفت", newSignal });
  } catch (err) {
    res.status(500).json({ message: "❌ فشل الإضافة", error: err.message });
  }
});

module.exports = router;
