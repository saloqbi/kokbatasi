
const express = require('express');
const router = express.Router();
const Signal = require('../models/signal');

// 📥 إضافة إشارة (من الواجهة أو من Webhook)
router.post('/', async (req, res) => {
  try {
    const signal = new Signal(req.body);
    await signal.save();
    res.status(201).json(signal);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في إدخال الإشارة' });
  }
});

// 📤 عرض الإشارات
router.get('/', async (req, res) => {
  try {
    const signals = await Signal.find().sort({ createdAt: -1 });
    res.json(signals);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب الإشارات' });
  }
});

// 📄 عرض إشارة واحدة حسب ID
router.get('/:id', async (req, res) => {
  try {
    const signal = await Signal.findById(req.params.id);
    if (!signal) return res.status(404).json({ error: 'الإشارة غير موجودة' });
    res.json(signal);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب الإشارة الواحدة' });
  }
});


module.exports = router;
