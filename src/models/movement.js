import User from "./user";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
const Schema = mongoose.Schema;
const movementSchema = new Schema(
  {
    name: String,
    description: String,
    dates: {
      expiration: Date,
      schedule: Date,
      reminders: [
        {
          name: String,
          date: Date
        }
      ]
    },
    // client: { type: Schema.Types.ObjectId, ref: 'User' },
    client: {
      type: { type: String, enum: ["Business", "Contact", "User"] },
      data: { type: Schema.Types.ObjectId, refPath: "client.type" },
      name: String
    },
    responsable: {
      type: { type: String, enum: ["Business", "Contact", "User"] },
      data: { type: Schema.Types.ObjectId, refPath: "responsable.type" },
      name: String
    },
    editor: { type: Schema.Types.ObjectId, ref: "User" },

    creator: { type: Schema.Types.ObjectId, ref: "User" },
    // responsable: { type: Schema.Types.ObjectId, ref: 'User' },
    personal: {
      client: { type: Schema.Types.ObjectId, ref: "User" },
      responsable: { type: Schema.Types.ObjectId, ref: "User" }
    },
    business: {
      client: { type: Schema.Types.ObjectId, ref: "Business" },
      provider: { type: Schema.Types.ObjectId, ref: "Business" }
    },
    isBusiness: { type: Boolean, default: false },
    lines: Array({ type: Schema.Types.ObjectId, ref: "Line" }),
    comments: Array({ type: Schema.Types.ObjectId, ref: "Comment" }),
    total: {
      opportunity: { type: Number, default: 0 },
      net: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      budget: { type: Number, default: 0 },
      profit: {
        number: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 }
      }
    },
    state: { type: String, default: "opportunity", enum: ["draft", "business", "budget", "opportunity"] },
    isActive: { type: Boolean, default: true },
    currency: { type: Schema.Types.ObjectId, ref: "Currency" }
    // contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
    // contactName: { type: String }
  },
  { timestamps: true }
);

movementSchema.plugin(mongoosePaginate);

const Movement = mongoose.model("Movement", movementSchema);
export default Movement;
