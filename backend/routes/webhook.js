const express = require('express');
const router = express.Router();
const Signal = require('../models/Signal');

module.exports = (io) => {
  router.post('/tradingview', async (req, res) => {
    try {
      const { symbol, action, price, time } = req.body;
      const signal = new Signal({ symbol, action, price, time });
      await signal.save();
      io.emit('new-signal', signal);
      res.json({ success: true, signal });
    } catch (error) {
      res.status(500).json({ error: 'فشل حفظ الإشارة' });
    }
  });

  router.get('/signals', async (req, res) => {
    try {
      const filter = {};
      if (req.query.symbol) filter.symbol = req.query.symbol;
      if (req.query.action) filter.action = req.query.action;
      const signals = await Signal.find(filter).sort({ time: -1 });
      res.json(signals);
    } catch (error) {
      res.status(500).json({ error: 'فشل جلب الإشارات' });
    }
  });

  return router;
};
