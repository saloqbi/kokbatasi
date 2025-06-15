// backend/models/signal.js

const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  recommendation: {
    type: String,
    enum: ['buy', 'sell'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  data: {
    type: Array,
    default: [],
  }
});

const Signal = mongoose.model('Signal', signalSchema);

module.exports = Signal;
