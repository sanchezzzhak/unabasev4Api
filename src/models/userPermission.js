import mongoose, { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate";

const userPermissionSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  permission: { type: Schema.Types.ObjectId, ref: "Permission" },
  business: { type: Schema.Types.ObjectId, ref: "Business" }
});

userPermission.plugin(mongoosePaginate);

const UserPermission = model("userPermission", userPermissionSchema);

export default UserPermission;
