const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongoosePaginate = require("mongoose-paginate");
const User = require("./user");

const incomeSchema = new Schema(
  {
    name: String,
    description: String,
    dates: {
      expiration: Date
    },
    client: { type: Schema.Types.ObjectId, ref: "User" },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    items: { type: Schema.Types.ObjectId, ref: "Item" },
    total: {
      net: Number,
      tax: Number
    },
    state: String,
    isActive: { type: Boolean, default: true },
    currency: {
      type: { type: Schema.Types.ObjectId, ref: "Currency" }
    }
  },
  { timestamps: true }
);

incomeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Outcome", incomeSchema);
