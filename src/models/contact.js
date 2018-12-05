import mongoose from 'mongoose';

import mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    isActive: { type: Boolean, default: true },
    name: String,
    emails: [{ email: String, label: String }],
    phones: [{ phone: String, label: String }],
    idnumber: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
