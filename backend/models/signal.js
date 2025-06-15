const mongoose = require("mongoose");

const signalSchema = new mongoose.Schema({
  title: String,
  recommendation: String,
  price: Number,
  data: [
    {
      time: String,
      open: Number,
      high: Number,
      low: Number,
      close: Number,
    },
  ],
  lines: [
    {
      y: Number,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Signal", signalSchema);
