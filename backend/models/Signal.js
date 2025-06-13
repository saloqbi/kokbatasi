
const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema({
  symbol: String,
  action: String,
  price: Number,
  type: String,
  date: String,
  data: Array
}, { timestamps: true });

module.exports = mongoose.model('Signal', signalSchema);
