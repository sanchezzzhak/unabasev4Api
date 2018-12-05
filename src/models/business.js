import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;

const businessSchema = Schema(
  {
    isActive: {
      type: Boolean,
      default: true
    },
    name: String,
    legalName: String, // razón social,
    businessType: String, // giro
    idnumber: String,
    phones: [{ phone: String, label: String }],
    emails: [{ email: String, label: String }],
    address: {
      street: String,
      number: Number,
      district: String,
      city: String,
      region: String,
      country: String
    },
    website: String,
    v3: {
      ip: String,
      nodePort: Number,
      webPort: Number,
      url: String
    },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    admins: Array({
      description: String,
      user: { type: Schema.Types.ObjectId, ref: 'User' }
    })
  },
  { timestamps: true }
);
businessSchema.plugin(mongoosePaginate);
const Business = mongoose.model('Business', businessSchema);

export default Business;
