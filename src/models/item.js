const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const mongoosePaginate = require("mongoose-paginate");

const itemSchema = new Schema(
  {
    name: String,
    tax: { type: Schema.Types.ObjectId, ref: "Tax" }
  },
  { timestamps: true }
);

// itemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Item", itemSchema);
