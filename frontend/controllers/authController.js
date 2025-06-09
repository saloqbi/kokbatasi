const User = require("../models/User");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
  }

  const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "7d" });
  res.json({ user: { id: user._id, username: user.username }, token });
};

module.exports = { loginUser };