const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema(
  {
    symbol: String,
    price: Number,
    type: String,
    date: String,
    data: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Signal', signalSchema);
