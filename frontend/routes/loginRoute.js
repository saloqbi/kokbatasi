const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: "اسم المستخدم غير صحيح" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "كلمة المرور غير صحيحة" });
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, "secretkey");
  res.json({ token, user: { username: user.username, role: user.role } });
});

module.exports = router;