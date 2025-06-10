import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const GannSchema = new mongoose.Schema({
  origin: Object,
  lines: Array,
  circles: Array,
  fanLines: Array,
  tool: String,
}, { timestamps: true });

const GannDrawing = mongoose.model('GannDrawing', GannSchema);

router.post('/save-gann', async (req, res) => {
  const newDrawing = new GannDrawing(req.body);
  await newDrawing.save();
  res.status(201).json({ message: 'Saved successfully' });
});

router.get('/get-gann', async (req, res) => {
  const drawings = await GannDrawing.find().sort({ createdAt: -1 }).limit(10);
  res.json(drawings);
});

export default router;
