
import mongoose from 'mongoose';

const signalSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['Buy', 'Sell'],
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    default: [],
  },
}, {
  timestamps: true
});

const signal = mongoose.model('signal', signalSchema);

module.exports = mongoose.model('signal', signalSchema);
