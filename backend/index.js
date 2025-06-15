
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(express.json());

connectDB();


console.log("✅ يتم تحميل الخادم الآن");

try {
  const signalRoutes = require("./routes/signals");
  app.use("/api/signals", signalRoutes);
  console.log("✅ تم ربط مسار /api/signals");
} catch (e) {
  console.error("❌ فشل في تحميل مسار signals:", e.message);
}


// ✅ هذا السطر هو الأهم
app.use("/api/signals", require("./routes/signals")); 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
