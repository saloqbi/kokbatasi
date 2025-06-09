const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema({
  symbol: String,
  action: String,
  price: Number,
  time: String,
}, { timestamps: true });

module.exports = mongoose.model('Signal', signalSchema);
