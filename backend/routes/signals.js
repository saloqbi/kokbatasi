const express = require("express");
const router = express.Router();
const Signal = require("../models/signal");

router.get("/seed", async (req, res) => {
  try {
    const signal = new Signal({
      symbol: "AAPL-" + Date.now(),
      action: "buy"
    });

    await signal.save();
    res.json({ message: "تم إدخال التوصية بنجاح" });
  } catch (err) {
    console.error("❌ خطأ في تنفيذ /seed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;