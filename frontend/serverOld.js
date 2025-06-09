const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const loginRoute = require("./routes/login");
const signalRoutes = require("./routes/signals");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/tasi_db")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", loginRoute);
app.use("/api/signals", signalRoutes);
app.use("/api/users", userRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});