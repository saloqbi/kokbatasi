
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const signalSchema = new mongoose.Schema({
  symbol: String,
  action: String,
  time: Date,
});

const Signal = mongoose.model('Signal', signalSchema);

// GET all signals
router.get('/', async (req, res) => {
  const signals = await Signal.find().sort({ time: -1 });
  res.json(signals);
});

// POST a new signal
router.post('/', async (req, res) => {
  const newSignal = new Signal(req.body);
  await newSignal.save();
  res.status(201).json(newSignal);
});

export default router;
