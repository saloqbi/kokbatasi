const express = require('express');
const router = express.Router();

const { getSignals, createSignal } = require('../controllers/signalController');

router.get('/', getSignals);
router.post('/', createSignal);

module.exports = router;
