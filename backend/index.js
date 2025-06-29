const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const signalRoutes = require("./routes/signals");
const toolRoutes = require("./routes/tools");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/signals", signalRoutes);
app.use("/api/tools", toolRoutes);


// ✅ الاتصال بقاعدة البيانات
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

module.exports = app;
