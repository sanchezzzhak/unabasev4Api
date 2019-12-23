import mongoose, {
  Schema as _Schema,
  model
} from "mongoose";
import mongoosePaginate from "mongoose-paginate";
let Schema = _Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

let permissionSchema = Schema({
  description: String,
  name: {
    type: String,
    required: true
  },
  action: {
    type: String,
    Enum: ["create", "delete", "null", "update", "action", "read"]
  },
  path: String,
  type: {
    type: String,
    enum: ["internal", "external", "general"],
    default: "general"
  },
  module: {
    type: String
  },
  all: {
    type: Boolean,
    defaul: false
  }
});
permissionSchema.plugin(AutoIncrement, {
  inc_field: "number"
});

permissionSchema.plugin(mongoosePaginate);
// let User = module.exports = mongoose.model('User', userSchema);
const Permission = mongoose.model("Permission", permissionSchema);

// let Permission = mongoose.model('permission', permissionSchema);

// module.exports = Permission;
export default Permission;