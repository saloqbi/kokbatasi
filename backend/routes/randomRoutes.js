
const express = require('express');
const router = express.Router();
const Signal = require('../models/signal');
const { broadcastNewSignal } = require('../utils/socket');

// توليد توصية عشوائية
function generateRandomSignal() {
  const types = ['Buy', 'Sell'];
  const symbols = ['TASI', 'BTC', 'ETH', 'AAPL', 'SP500'];
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  const randomPrice = (Math.random() * 300 + 50).toFixed(2);
  const randomType = types[Math.floor(Math.random() * types.length)];
  const date = new Date().toISOString().split('T')[0];

  return {
    symbol: randomSymbol,
    price: randomPrice,
    type: randomType,
    date
  };
}

// POST /api/signals/random
router.post('/random', async (req, res) => {
  try {
    const generated = [];

    for (let i = 0; i < 5; i++) {
      const signal = new Signal(generateRandomSignal());
      const saved = await signal.save();
      broadcastNewSignal(saved);
      generated.push(saved);
    }

    res.status(201).json({ message: 'Random signals generated', data: generated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate signals' });
  }
});

module.exports = router;
