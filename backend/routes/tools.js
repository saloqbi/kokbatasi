const express = require("express");
const router = express.Router();
const Tool = require("../models/Tool");

// 📥 إنشاء أداة جديدة
router.post("/", async (req, res) => {
  try {
    const tool = new Tool(req.body);
    const saved = await tool.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: "❌ فشل في حفظ الأداة" });
  }
});

// 📤 استرجاع الأدوات الخاصة بتوصية
router.get("/:signalId", async (req, res) => {
  try {
    const tools = await Tool.find({ signalId: req.params.signalId });
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: "❌ فشل في جلب الأدوات" });
  }
});

// 🔄 تعديل أداة
router.put("/:id", async (req, res) => {
  try {
    await Tool.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "❌ فشل التحديث" });
  }
});

module.exports = router;
