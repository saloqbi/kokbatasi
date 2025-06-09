
const express = require("express");
const router = express.Router();
const Signal = require("../models/Signal");

router.get("/", async (req, res) => {
  try {
    const { market, type, status, fromDate, toDate } = req.query;

    const filter = {};

    if (market) filter.market = market;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = new Date(fromDate);
      if (toDate) filter.date.$lte = new Date(toDate);
    }

    const signals = await Signal.find(filter).sort({ date: -1 });
    res.json(signals);
  } catch (error) {
    console.error("Error fetching signals:", error);
    res.status(500).json({ message: "خطأ أثناء جلب الإشارات" });
  }
});

module.exports = router;
