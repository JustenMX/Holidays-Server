require("dotenv").config();
const express = require("express");

const PORT = process.env.PORT ?? 3000;
const app = express();

app.get("/", (req, res) => {
  res.send({ msg: "Holidays" });
});

app.listen(PORT, () => {
  console.log(`Express listing on ${PORT}`);
});
