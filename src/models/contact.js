import mongoose from "mongoose";

import mongoosePaginate from "mongoose-paginate";

const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    isActive: { type: Boolean, default: true },
    name: String,
    email: String,
    phone: String,
    phones: [{ _id: false, phone: String, label: String }],
    emails: [{ _id: false, email: String, label: String }],
    // type and link DEPRECATED, contact must be only from users
    type: { type: String, enum: ["Business", "User"] },
    link: { type: Schema.Types.ObjectId, refPath: "type" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    // business: Array({ type: Schema.Types.ObjectId, ref: "Business" }),
    business: {
      _id: false,
      name: { type: String },
      id: { type: String }
    },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    company: {
      idNumber: { type: String },
      legalName: { type: String },
      business: { type: Schema.Types.ObjectId, ref: "Business" }
    }
  },
  { timestamps: true }
);
contactSchema.plugin(mongoosePaginate);
const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
