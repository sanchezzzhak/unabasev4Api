import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
const Schema = mongoose.Schema;

const businessSchema = Schema(
  {
    isActive: {
      type: Boolean,
      default: true
    },
    name: String,
    legalName: String, // razón social,
    businessType: Array({
      _id: false,
      name: String,
      number: Number
    }), // giro
    idNumber: String,
    phones: [
      {
        _id: false,
        phone: String,
        label: String
      }
    ],
    emails: [
      {
        _id: false,
        email: String,
        label: String
      }
    ],
    imgUrl: String,
    address: {
      lat: String,
      long: String,
      text: String,
      address: {
        lat: String,
        long: String,
        text: String
      }
    },
    website: String,
    currency: {
      type: String,
      ref: "Currency"
    },
    creator: {
      type: String,
      ref: "User"
    },
    // admins: Array({
    //   _id: false,
    //   description: { type: String },
    //   user: { type: String, ref: 'User' }
    // }),
    users: Array({
      _id: false,
      user: {
        type: String,
        ref: "User"
      },
      description: {
        type: String
      }
    })
  },
  {
    timestamps: true
  }
);
businessSchema.plugin(mongoosePaginate);
const Business = mongoose.model("Business", businessSchema);

export default Business;
