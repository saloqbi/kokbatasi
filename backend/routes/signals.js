
const express = require("express");
const router = express.Router();
const Signal = require("../models/signal");

console.log("✅ ملف signals.js تم تحميله بنجاح");

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

// ✅ seed
router.get("/seed", async (req, res) => {
  console.log("📌 تم الوصول لمسار /seed");

  try {
    const newSignal = await Signal.create({
      symbol: "BTCUSDT",
      action: "buy",
      lines: [],
      zones: []
    });
    console.log("✅ تم إدخال التوصية:", newSignal);
    res.json({ message: "✅ توصية أُضيفت", newSignal });
  } catch (err) {
    console.error("❌ خطأ في /seed:", err);
    res.status(500).json({
      message: "Server error",
      fullError: JSON.stringify(err, Object.getOwnPropertyNames(err))
    });
  }
});

module.exports = router;
