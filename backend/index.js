const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const signalsRoutes = require("./routes/signals");

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb+srv://admin:admin123@kokbatasi-db.0ltpmeg.mongodb.net/kokbatasi-db?retryWrites=true&w=majority&appName=kokbatasi-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("✅ MongoDB connected");
});

app.use("/api/signals", signalsRoutes);

module.exports = app;