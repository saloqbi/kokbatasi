
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "الرجاء إدخال اسم المستخدم وكلمة المرور" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "المستخدم غير موجود" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "كلمة المرور غير صحيحة" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "حدث خطأ أثناء تسجيل الدخول" });
  }
});

module.exports = router;
