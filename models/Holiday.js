const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema({
  title: { type: String, unique: true },
  likes: Number,
  active: Boolean,
  celebrated: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
});

const Holiday = mongoose.model("Holiday", holidaySchema);

module.exports = Holiday;
