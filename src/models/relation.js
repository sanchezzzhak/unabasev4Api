import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseConfig from "../config/paginate";

const relationSchema = Schema(
  {
    isActive: { type: Boolean },
    petitioner: { type: String, ref: "User" },
    receptor: { type: String, ref: "User" }
  },
  { timestamps: true }
);
relationSchema.plugin(mongoosePaginate);

const Relation = mongoose.model("Relation", relationSchema);
mongoosePaginate.paginate.options = mongooseConfig;
export default Relation;
