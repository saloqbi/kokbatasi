const express = require("express");
const router = express.Router();
const Signal = require("../models/Signal");

router.put("/:id/lines", async (req, res) => {
  try {
    const { id } = req.params;
    const { lines } = req.body;
    const signal = await Signal.findByIdAndUpdate(id, { lines }, { new: true });
    res.json(signal);
  } catch (err) {
    res.status(500).json({ message: "خطأ في حفظ الخطوط" });
  }
});

router.put("/:id/zones", async (req, res) => {
  try {
    const { id } = req.params;
    const { zones } = req.body;
    const signal = await Signal.findByIdAndUpdate(id, { zones }, { new: true });
    res.json(signal);
  } catch (err) {
    res.status(500).json({ message: "خطأ في حفظ المناطق" });
  }
});

module.exports = router;
