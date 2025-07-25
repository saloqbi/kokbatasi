const mongoose = require("mongoose");
const Signal = require("./models/signal");

const MONGO_URI = "mongodb+srv://admin:admin123@kokbatasi-db.0ltpmeg.mongodb.net/kokbatasi?retryWrites=true&w=majority&appName=kokbatasi-db";

mongoose.connect(MONGO_URI)
  .then(async () => {
    await Signal.create({
      symbol: "BTCUSDT",
      action: "buy",
      lines: [],
      zones: []
    });
    console.log("✅ تم إدخال التوصية بنجاح");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ فشل الاتصال أو الإدخال:", err);
    process.exit(1);
  });
