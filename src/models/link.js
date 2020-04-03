import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseConfig from "../config/paginate";

const linkSchema = Schema(
  {
    user: { type: String, ref: "User" },
    description: { type: String },
    url: { type: String },
    name: { type: String },
    type: { type: String, enum: ["image", "video"] },
    members: Array({
      user: { type: String, ref: "User" },
      contact: { type: String, ref: "Contact" },
      positions: Array({ type: String, ref: "Section" })
    })
  },
  { timestamps: true }
);

linkSchema.plugin(mongoosePaginate);

const Link = mongoose.model("Link", linkSchema);
mongoosePaginate.paginate.options = mongooseConfig;
export default Link;
