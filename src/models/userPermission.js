import mongoose, { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import Permission from "./permission";

const userPermissionSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  permission: { type: Schema.Types.ObjectId, ref: "Permission" },
  business: { type: Schema.Types.ObjectId, ref: "Business" }
});

userPermissionSchema.plugin(mongoosePaginate);

const UserPermission = mongoose.model("userPermission", userPermissionSchema);

UserPermission.findByPermission = function(data, callback) {
  const query = this.findOne();
  const { permission, user, business } = data;
  Permission.findOne(permission, (err, permission) => {
    if (err) {
      console.log(err);
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
