const mongoose = require("mongoose");

const SignalSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  action: { type: String, enum: ["buy", "sell", "neutral"], required: true },
  price: { type: Number },

  // ✅ الشموع اليابانية
  data: {
    type: [
      {
        time: String,
        open: Number,
        high: Number,
        low: Number,
        close: Number
      }
    ],
    default: [] // ✅ يجعل الحقل اختياري ويمنع فشل الحفظ
  },

  // ✅ الخطوط اليدوية (مثل خطوط الاتجاه)
  lines: {
    type: Array,
    default: [],
  },

  // ✅ مناطق الدعم والمقاومة
  zones: [
    {
      x: Number,
      y: Number,
      width: Number,
      height: Number
    }
  ],

  // ✅ نماذج الفراكتل
  fractals: [
    {
      index: Number,
      type: { type: String }, // "top" أو "bottom"
      price: Number
    }
  ],

  // ✅ موجات إليوت
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
