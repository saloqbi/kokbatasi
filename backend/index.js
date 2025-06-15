
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

console.log("✅ بدء تحميل index.js");

// ✅ تأكد من ربط مسار signals
try {
  const signalRoutes = require("./routes/signals");
  app.use("/api/signals", signalRoutes);
  console.log("✅ تم ربط /api/signals بنجاح");
} catch (err) {
  console.error("❌ فشل في ربط /api/signals:", err);
}

// ✅ تأكيد تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
