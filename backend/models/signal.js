const mongoose = require("mongoose");

const SignalSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  action: { type: String, enum: ["buy", "sell", "neutral"], required: true },
  price: { type: Number },

  // ✅ الشموع
  data: [
    {
      time: String,
      open: Number,
      high: Number,
      low: Number,
      close: Number
    }
  ],

  // ✅ الحقول المرنة لتحليل الفني
  lines: {
    type: Array,
    default: [],
  },
  zones: [
    { x: Number, y: Number, width: Number, height: Number }
  ],
  fractals: [
    {
      index: Number,
      type: { type: String }, // "top" أو "bottom"
      price: Number
    }
  ],
  waves: [
    {
      label: String,
      index: Number,
      price: Number
    }
  ],

  createdAt: { type: Date, default: Date.now }
}, { collection: "signals" });

module.exports = mongoose.models.Signal || mongoose.model("Signal", SignalSchema);
