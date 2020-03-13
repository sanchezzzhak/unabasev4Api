import mongoose, { Schema } from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";
import paginateConfig from "../config/paginate";

const sectionSchema = Schema(
  {
    name: { type: String },
    users: Array({ type: String, ref: "User" })
  },
  { timestamps: true }
);
sectionSchema.plugin(mongoosePaginate);

mongoosePaginate.paginate.options = paginateConfig;
const Section = mongoose.model("Section", sectionSchema);

export default Section;
