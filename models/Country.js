const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  region: String,
});

const Country = mongoose.model("Country", countrySchema);

module.exports = Country;
