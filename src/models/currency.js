import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
const Schema = mongoose.Schema;

const currencySchema = new Schema(
  {
    name: String,
    decimal: { type: String, enum: [",", "."] },
    thousand: { type: String, enum: [",", "."] },
    prefix: String,
    suffix: String,
    precision: { type: Number, min: 0, max: 10 },
    countryOrigin: String
  },
  { timestamps: true }
);

currencySchema.plugin(mongoosePaginate);
currencySchema.post("update", function() {
  const modifiedFields = this.getUpdate().$set;
  console.log("------");
  console.log(modifiedFields);
});
currencySchema.post("findOneAndUpdate", function() {
  const modifiedFields = this.getUpdate().$set;
  console.log("------");
  console.log(modifiedFields);
});
const Currency = mongoose.model("Currency", currencySchema);
export default Currency;
