const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongoosePaginate = require("mongoose-paginate");
const User = require("./user");

const outcomeSchema = new Schema(
  {
    name: String,
    description: String,
    dates: {
      expiration: Date
    },
    client: { type: Schema.Types.ObjectId, ref: "Users" },
    creator: { type: Schema.Types.ObjectId, ref: "Users" },
    items: Array(Object),
    total: {
      net: Number,
      tax: Number
    },
    state: String,
    isActive: { type: Boolean, default: true },
    currency: {
      type: { type: Schema.Types.ObjectId, ref: "Currencies" }
    }
  },
  { timestamps: true }
);

outcomeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Outcome", outcomeSchema);
