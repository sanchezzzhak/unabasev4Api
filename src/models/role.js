import mongoose, { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
const roleSchema = Schema({
  name: { type: String, required: true },
  permissions: Array({ type: Schema.Types.ObjectId, ref: Permission })
});
roleSchema.plugin(mongoosePaginate);

const Role = model("role", roleSchema);

export default Role;
