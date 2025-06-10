const express = require('express');
const router = express.Router();
const Signal = require('../models/Signal');

router.post('/webhook', async (req, res) => {
    try {
        const signal = new Signal(req.body);
        await signal.save();
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to store signal' });
    }
});

module.exports = router;