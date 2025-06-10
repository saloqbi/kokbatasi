import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import signalsRoute from './routes/signals.js';
import gannRoute from './routes/gann.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('🚀 Backend is live');
});

const signalsRoutes = require('./routes/signals');
app.use('/webhook', signalsRoutes);

// Routes
app.use('/api/signals', signalsRoute);
app.use('/api', gannRoute);

// MongoDB connect
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
router.post('/webhook/signals', async (req, res) => {
  // منطق الحفظ في MongoDB
});
