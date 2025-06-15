const mongoose = require("mongoose");

const SignalSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true },
    action: { type: String, enum: ["buy", "sell", "neutral"], required: true },
    lines: [
      { x1: Number, y1: Number, x2: Number, y2: Number }
    ],
    zones: [
      { x: Number, y: Number, width: Number, height: Number }
    ],
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "signals" }
);

module.exports = mongoose.model("Signal", SignalSchema);
