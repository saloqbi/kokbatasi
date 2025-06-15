const express = require('express');
const router = express.Router();
const { fetchCandles } = require('../services/candleService');

// GET /api/candles/:symbol
router.get('/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

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
