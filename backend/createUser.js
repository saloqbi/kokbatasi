const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/tasi_db");

const createUser = async () => {
  const existing = await User.findOne({ username: "admin" });
  if (existing) {
    console.log("⚠️ المستخدم موجود بالفعل.");
    return process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const user = new User({
    username: "admin",
    password: hashedPassword,
    role: "admin",
  });

  await user.save();
  console.log("✅ المستخدم 'admin' تم إنشاؤه بنجاح");
  process.exit(0);
};

createUser();