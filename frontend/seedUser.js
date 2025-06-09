const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://localhost:27017/kokbatasi").then(async () => {
  const user = new User({
    username: "admin",
    password: "123456",
    role: "admin"
  });

  await user.save();
  console.log("✅ تم إنشاء المستخدم admin بنجاح");
  mongoose.disconnect();
}).catch((err) => {
  console.error("❌ خطأ في الاتصال بقاعدة البيانات:", err);
});