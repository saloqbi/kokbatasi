const express = require('express');
const router = express.Router();
const { fetchCandles } = require('../services/candleService');

// GET /api/candles/:symbol
router.get('/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  // ✅ دعم خاص لـ TASI مؤقتًا
  if (symbol === "TASI") {
    return res.json({
      data: [
        { time: "2025-06-15", open: 100, high: 110, low: 95, close: 105 },
        { time: "2025-06-16", open: 105, high: 115, low: 100, close: 108 },
        { time: "2025-06-17", open: 108, high: 112, low: 104, close: 110 },
      ],
    });
  }

  try {
    const candles = await fetchCandles(symbol);

    // ✅ استجابة موحدة (time, open, high, low, close, volume)
    res.json(candles);
  } catch (error) {
    console.error(`❌ Error fetching candles for ${symbol}:`, error.message);
    res.status(500).json({ error: 'Failed to fetch candles from all sources.' });
  }
});

module.exports = router;
