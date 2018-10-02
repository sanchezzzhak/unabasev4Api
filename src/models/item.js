const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongoosePaginate = require("mongoose-paginate");

const itemSchema = new Schema(
  {
    name: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
