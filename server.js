require("dotenv").config();
//* dependencies
const log = require("debug")("holidays:server");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

//* configuration
const PORT = process.env.PORT ?? 3000;
const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/holidays";
const app = express();

mongoose.connect(MONGO_URI);
mongoose.connection.on("error", (err) =>
  log(err.message + " is Mongod not running?")
);
mongoose.connection.on("disconnected", () => log("mongo disconnected"));
mongoose.connection.once("open", () => {
  log("connected to mongoose...");
});

app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.send({ msg: "Holidays" });
});

app.listen(PORT, () => {
  log(`Express listing on ${PORT}`);
});
