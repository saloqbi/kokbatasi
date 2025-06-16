const mongoose = require("mongoose");

const SignalSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  action: { type: String, enum: ["buy", "sell", "neutral"], required: true },
  price: { type: Number }, // ✅ تم إضافته
  lines: [
    { x1: Number, y1: Number, x2: Number, y2: Number }
  ],
  zones: [
    { x: Number, y: Number, width: Number, height: Number }
  ],
  fractals: [ // ✅ نقاط فراكتل
    {
      index: Number,
      type: { type: String }, // "top" أو "bottom"
      price: Number
    }
  ],
  waves: [ // ✅ موجات إليوت
    {
      label: String,
      index: Number,
      price: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
}, { collection: "signals" });

module.exports = mongoose.model("Signal", SignalSchema);
