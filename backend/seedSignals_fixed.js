
const mongoose = require('mongoose');
require('dotenv').config();

const Signal = require('./models/Signal');

const MONGO_URI = process.env.MONGO_URI;

const sampleSignals = [
  {
    title: 'إشارة صعود',
    symbol: 'TASI',
    timeframe: '1D',
    direction: 'Buy',
    confidence: 85,
    recommendation: 'شراء قوي',
    createdAt: new Date(),
  },
  {
    title: 'إشارة هبوط',
    symbol: 'BTCUSD',
    timeframe: '4H',
    direction: 'Sell',
    confidence: 78,
    recommendation: 'بيع متوسط',
    createdAt: new Date(),
  },
  {
    title: 'إشارة جانبية',
    symbol: 'ETHUSD',
    timeframe: '1H',
    direction: 'Neutral',
    confidence: 65,
    recommendation: 'انتظار ومراقبة',
    createdAt: new Date(),
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Signal.deleteMany({});
    console.log('🗑️ Cleared old signals');

    await Signal.insertMany(sampleSignals);
    console.log('✅ Inserted sample signals');

    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  }
}

seed();
