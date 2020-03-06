import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import paginateConfig from "../config/paginate";

const notificationSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String },
    from: {
      user: { type: String, ref: "User" },
      other: { type: String }
    },
    user: { type: String, ref: "User" },
    users: Array({ type: String, ref: "User" }),
    link: { type: String },
    isRead: { type: Boolean, default: false },
    movement: { type: String, ref: "Movement" }
  },
  { timestamps: true }
);

notificationSchema.plugin(mongoosePaginate);
mongoosePaginate.paginate.options = paginateConfig;

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
