const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const signalRoutes = require('./routes/signals');

dotenv.config();
const app = express();
app.use(express.json());
connectDB();

// ✅ ربط المسارات
app.use("/api/signals", signalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
