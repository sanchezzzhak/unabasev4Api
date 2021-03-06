import mongoose, { Schema, model } from "mongoose";
// import mongoosePaginate from "mongoose-paginate";
import mongoosePaginate from "mongoose-paginate-v2";
import paginateConfig from "../config/paginate";
import Permission from "./permission";

const userPermissionSchema = Schema({
  user: { type: String, ref: "User" },
  permission: { type: String, ref: "Permission" },
  business: { type: String, ref: "Business" }
});

userPermissionSchema.plugin(mongoosePaginate);

mongoosePaginate.paginate.options = paginateConfig;
userPermissionSchema.index({ user: 1, business: 1, permission: 1 }, { unique: true });

const UserPermission = mongoose.model("UserPermission", userPermissionSchema);

UserPermission.findByPermission = function(data, callback) {
  const query = this.findOne();
  const { permission, user, business } = data;
  Permission.findOne(permission, (err, permission) => {
    if (err) {
      logy(err);
      return null;
    } else if (permission) {
      query.where({ permission: permission._id, user, business }).exec(callback);
      return query;
    } else {
      return null;
    }
  });
};
export default UserPermission;
