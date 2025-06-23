const express = require("express");
const router = express.Router();

const {
  getSignals,
  createSignal,
  generateRandomSignals,
  updateSignalDrawings
} = require("../controllers/signalController");

const { saveLines } = require("../controllers/signalToolsController"); // ✅ لحفظ الخطوط

// ✅ توليد توصيات عشوائية
router.get("/generate", generateRandomSignals);

// ✅ جلب كل التوصيات
router.get("/", getSignals);

// ✅ جلب توصية واحدة
router.get("/:id", async (req, res) => {
  try {
    const signal = await require("../models/signal").findById(req.params.id);
    if (!signal) {
      return res.status(404).json({ message: "Signal not found" });
    }

    res.status(200).json(signal);
  } catch (err) {
    console.error("❌ Error fetching signal by ID:", err);
    res.status(500).json({ message: "Server error", error: String(err) });
  }
});

// ✅ إنشاء توصية جديدة
router.post("/", createSignal);

// ✅ تحديث أدوات الرسم (خطوط، مناطق...)
router.put("/:id/drawings", updateSignalDrawings);

// ✅ حفظ خطوط الاتجاه (Trendlines)
router.post("/:id/tools/lines", saveLines); // ✅ جاهز للاستقبال من الواجهة

module.exports = router;
