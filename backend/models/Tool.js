const mongoose = require("mongoose");

const ToolSchema = new mongoose.Schema({
  type: { type: String, required: true }, // مثل line أو rect
  x1: Number,
  y1: Number,
  x2: Number,
  y2: Number,
  signalId: { type: mongoose.Schema.Types.ObjectId, ref: "Signal", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Tool", ToolSchema);
