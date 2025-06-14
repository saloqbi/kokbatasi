// backend/models/signal.js

const mongoose = require('mongoose');

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
    enum: ['buy', 'sell'],
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    default: [],
  }
});

const Signal = mongoose.model('Signal', signalSchema);

module.exports = Signal;
