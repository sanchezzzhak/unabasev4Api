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
    client: {
      name: String,
      // save the user if the contact created or selected has a user reference.
      user: { type: String, ref: "User" },
      // save the contact id
      contact: { type: String, ref: "Contact" },
      // save the business id if the user has businesses and one of them is selected
      business: { type: String, ref: "Business" },
      // if one business from the SII if seleted, we save the id and the name
      businessData: {
        id: { type: String },
        name: { type: String }
      }
    },
    responsable: {
      // save a name for the client if no contact is created.
      name: String,
      // save the user if the contact created or selected has a user reference.
      user: { type: String, ref: "User" },
      // save the contact id
      contact: { type: String, ref: "Contact" },
      // save the business id if the user has businesses and one of them is selected
      business: { type: String, ref: "Business" },
      // if one business from the SII if seleted, we save the id and the name
      businessData: {
        id: { type: String },
        name: { type: String }
      }
    },
    editor: { type: String, ref: "User" },

    creator: { type: String, ref: "User" },

    isBusiness: { type: Boolean, default: false },
    lines: Array({ type: String, ref: "Line" }),
    comments: Array({ type: String, ref: "Comment" }),
    successPercentage: { type: Number },
    total: {
      opportunity: { type: Number, default: 0 },
      net: { type: Number, default: 0 },
      // tax: { type: Number, default: 0 },
      // tax: { type: Object },
      tax: {
        total: { type: Number, default: 0 },
        detail: [{ name: String, number: Number }]
      },
      budget: { type: Number, default: 0 },
      profit: {
        number: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 }
      }
    },
    /**
     * Opportunity: without client and without lines
     * Draft: request of a budget by someone
     * Budget: with client or lines without approval
     * Business: with client and lines, approved and check by the user
     *
     */
    state: { type: String, default: "opportunity", enum: ["draft", "business", "budget", "opportunity"] },
    isActive: { type: Boolean, default: true },
    currency: { type: String, ref: "Currency" }
    // currency: { type: String }
  },
  { timestamps: true }
);

movementSchema.plugin(mongoosePaginate);

const Movement = mongoose.model("Movement", movementSchema);
export default Movement;
