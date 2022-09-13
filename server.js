require("dotenv").config();
//* dependencies
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const log = require("debug")("holidays:server");
const mongoose = require("mongoose");
const Country = require("./models/Country");
const Holiday = require("./models/Holiday");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
// const { reset } = require("nodemon");

//* configuration
const PORT = process.env.PORT ?? 3000;
const SECRET = process.env.SECRET ?? "mysecret";
const MONGO_URI =
  process.env.MONGO_URI ??
  "mongodb+srv://JustenMX:YwjyvoCTcsZQbonS@clusterjustenmx.qnlvw4g.mongodb.net/test";
const app = express();

mongoose.connect(MONGO_URI);
mongoose.connection.on("error", (err) =>
  console.log(err.message + " is Mongod not running?")
);
mongoose.connection.on("disconnected", () => console.log("mongo disconnected"));
mongoose.connection.once("open", () => {
  console.log("connected to mongoose...");
});

app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.send({ msg: "Holidays" });
});

//* Create route for Holidays
app.post("/holidays", async (req, res) => {
  const newHoliday = req.body;
  log("newHoliday %o", newHoliday);

  const { title } = newHoliday;
  const result = await Holiday.find({ title });
  log("results:%d after searching %o", result.length, title);

  if (result.length > 0) {
    res.json({ msg: "Too many" });
  } else {
    Holiday.create(newHoliday, (error, holiday) => {
      res.json(holiday);
    });
  }
});

//* Users
app.post("/login", (req, res) => {
  if (req.body.username === "admin") {
    const payload = { name: "Justen" };
    const token = jwt.sign(payload, SECRET);
    res.json({ token, msg: "Ok" });
  } else {
    res.json({ msg: "Fail" });
  }
});

//* Seeding Countries
app.get("/countries/seed", async (req, res) => {
  const countries = [
    { title: "Singapore", region: "Asia" },
    { title: "Italy", region: "Europe" },
    { title: "Thailand", region: "Asia" },
    { title: "Malaysia", region: "Asia" },
    { title: "United Kingdom", region: "Europe" },
  ];
  await Country.deleteMany({});
  const result = await Country.insertMany(countries);
  res.json(result);
});

app.get("/countries", async (req, res) => {
  const countries = await Country.find();

  res.json(countries);
});

//* Port Listener
app.listen(PORT, () => {
  console.log(`Express listing on ${PORT}`);
});
