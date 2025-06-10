
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import signalsRoutes from './routes/signals.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/signals', signalsRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => console.error(err));
