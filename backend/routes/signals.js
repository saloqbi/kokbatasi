import express from 'express';
const router = express.Router();

// Sample GET route
router.get('/', (req, res) => {
  res.json({ message: '📡 Signals endpoint is working' });
});

export default router;
