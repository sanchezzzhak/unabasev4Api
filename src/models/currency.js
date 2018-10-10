const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const currencySchema = new Schema(
  {
    name: String,
    decimal: { type: String, enum: [",", "."] },
    thousands: { type: String, enum: [",", "."] },
    prefix: String,
    suffix: String,
    precision: { type: Number, min: 0, max: 10 }
  },
  { timestamps: true }
);

const Currency = mongoose.model("Currency", currencySchema);
module.exports = Currency;
