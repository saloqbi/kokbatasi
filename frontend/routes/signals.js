import express from 'express';
const router = express.Router();

// Sample GET route
router.get('/', (req, res) => {
  res.json({ message: '📡 Signals endpoint is working' });
});

router.post('/webhook/signals', async (req, res) => {
  // ... منطق حفظ التوصية
});

export default router;
