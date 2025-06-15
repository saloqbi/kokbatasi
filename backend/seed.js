const mongoose = require("mongoose");
const Signal = require("./models/Signal");

mongoose.connect("YOUR_MONGO_URI")
  .then(async () => {
    await Signal.create({
      _id: "664dc95e362d3b1d6f69d8cc",
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
