import mongoose, { Schema as _Schema, model } from "mongoose";
let Schema = _Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

let permissionSchema = Schema({
  name: { type: String, required: true },
  description: String,
  name: { type: String, required: true },
  action: { type: String, Enum: ["create", "delete", "null", "update", "action", "read"] },
  path: String,
  type: { type: String, enum: ["internal", "external"] },
  all: { type: Boolean, defaul: false }
});
// permissionSchema.plugin(AutoIncrement, { inc_field: 'id' });

// let User = module.exports = mongoose.model('User', userSchema);
const Permission = mongoose.model("permission", permissionSchema);

// let Permission = mongoose.model('permission', permissionSchema);

// module.exports = Permission;
export default Permission;
