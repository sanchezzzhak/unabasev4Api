import mongoose, { Schema } from "mongoose";
// import mongoosePaginate from "mongoose-paginate";
import mongoosePaginate from "mongoose-paginate-v2";
import paginateConfig from "../config/paginate";
const roleSchema = Schema({
  name: { type: String, required: true },
  permissions: Array({ type: Schema.Types.ObjectId, ref: "Permission" })
});
roleSchema.plugin(mongoosePaginate);

mongoosePaginate.paginate.options = paginateConfig;
const Role = mongoose.model("Role", roleSchema);

export default Role;
