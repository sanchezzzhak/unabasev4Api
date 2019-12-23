import mongoose, {
  Schema
} from "mongoose";
import mongoosePaginate from "mongoose-paginate";
const roleSchema = Schema({
  name: {
    type: String,
    required: true
  },
  permissions: Array({
    type: Schema.Types.ObjectId,
    ref: "Permission"
  })
});
roleSchema.plugin(mongoosePaginate);

const Role = mongoose.model("Role", roleSchema);

export default Role;