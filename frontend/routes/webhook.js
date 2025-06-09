const express = require('express');
const router = express.Router();
const Signal = require('../models/Signal');

router.post('/tradingview', async (req, res) => {
  const alert = req.body;

  console.log('📩 تم استلام تنبيه من TradingView:', alert);

  try {
    await Signal.create(alert);
    res.status(200).json({ message: '✅ تم استقبال وحفظ التنبيه بنجاح' });
  } catch (err) {
    console.error('❌ خطأ في حفظ الإشارة:', err);
    res.status(500).json({ error: 'فشل حفظ الإشارة' });
  }
});

module.exports = router;
