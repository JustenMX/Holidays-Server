require("dotenv").config();
//* dependencies
const log = require("debug")("holidays:server");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Country = require("./models/Country");
const Holiday = require("./models/Holiday");

//* configuration
const PORT = process.env.PORT ?? 3000;
const SECRET = process.env.SECRET ?? "mysecret";
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
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ msg: "Holidays" });
});

//* Create route for Holidays
app.post("/holidays", async (req, res) => {
  const newHoliday = req.body;
  log("newHoliday %o", newHoliday);

  const { title } = newHoliday;
  const result = await Holiday.find({ title });
  log("results:%d after searching %o", result.length, title);

  if (result.length > 0) {
    log("sending too many message");
    res.json({ msg: "Too many" });
  } else {
    Holiday.create(newHoliday, (error, holiday) => {
      res.json({ msg: "ok", data: holiday });
    });
  }
});

app.post("/login", (req, res) => {
  if (req.body.username === "admin") {
    const payload = { name: "simon" };
    const token = jwt.sign(payload, SECRET);
    res.json({ token, msg: "Ok" });
  } else {
    res.json({ msg: "Fail" });
  }
});

app.get("/holidays", async (req, res) => {
  const holidays = await Holiday.find();
  res.json(holidays);
});

app.delete("/holidays/:id", async (req, res) => {
  const { id } = req.params;
  const holiday = await Holiday.findByIdAndDelete(id);
  // res.send(holiday.lean());
  res.json(holiday);
});

app.get("/countries/seed", async (req, res) => {
  const countries = [
    { title: "Singapore" },
    { title: "Italy" },
    { title: "Thailand" },
  ];

  await Country.deleteMany({});

  const result = await Country.insertMany(countries);

  res.json(result);
});

app.get("/countries", async (req, res) => {
  const countries = await Country.find();

  res.json(countries);
});

app.listen(PORT, "0.0.0.0", () => {
  log(`Express listing on ${PORT}`);
});
