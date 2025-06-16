const express = require("express");
const router = express.Router();
const {
  getSignals,
  createSignal,
  generateRandomSignals,
  updateSignalDrawings
} = require("../controllers/signalController");

// ✅ توليد توصيات عشوائية
router.get("/generate", generateRandomSignals);

// ✅ جلب كل التوصيات
router.get("/", getSignals);

// ✅ جلب توصية واحدة
router.get("/:id", async (req, res) => {
  try {
    const signal = await require("../models/signal").findById(req.params.id);
    if (!signal) return res.status(404).json({ message: "Not found" });
    res.json(signal);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: String(err) });
  }
});

// ✅ إنشاء توصية جديدة
router.post("/", createSignal);

// ✅ تحديث أدوات الرسم
router.put("/:id/drawings", updateSignalDrawings);

module.exports = router;
