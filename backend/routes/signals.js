const express = require("express");
const router = express.Router();
const Signal = require("../models/Signal");

router.put("/:id/lines", async (req, res) => {
  const { id } = req.params;
  const { lines } = req.body;
  const signal = await Signal.findByIdAndUpdate(id, { lines }, { new: true });
  res.json(signal);
});

    res.json(signal);
  } catch (err) {
    console.error("❌ خطأ في حفظ الخطوط:", err);
    res.status(500).json({ message: "فشل في حفظ الخطوط" });
  }
});

module.exports = router;
