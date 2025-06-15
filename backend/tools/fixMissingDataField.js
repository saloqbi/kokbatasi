// tools/fixMissingDataField.js

const mongoose = require("mongoose");
const Signal = require("../models/signal");

// الاتصال بـ MongoDB
const MONGO_URI = "mongodb+srv://admin:admin123@kokbatasi-db.0ltpmeg.mongodb.net/?retryWrites=true&w=majority&appName=kokbatasi-db";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ متصل بـ MongoDB");

    const signals = await Signal.find();
    let updatedCount = 0;

    for (const signal of signals) {
      if (!Array.isArray(signal.data)) {
        signal.data = [];
        await signal.save();
        updatedCount++;
      }
    }

    console.log(`🎯 تم تحديث ${updatedCount} من الإشارات`);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ خطأ في الاتصال بـ MongoDB:", err);
  });