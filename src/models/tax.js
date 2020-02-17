import mongoose, { Schema } from "mongoose";
// import mongoosePaginate from 'mongoose-paginate';
import mongoosePaginate from "mongoose-paginate-v2";
import paginateConfig from "../config/paginate";
const taxSchema = new Schema(
  {
    name: String,
    number: { type: Number, default: 0 }
  },
  { timestamps: true }
);

taxSchema.plugin(mongoosePaginate);

mongoosePaginate.paginate.options = paginateConfig;
const Tax = mongoose.model("Tax", taxSchema);

export default Tax;
