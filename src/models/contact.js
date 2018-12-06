import mongoose from 'mongoose';

import mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    isActive: { type: Boolean, default: true },
    name: String,
    email: String,
    phone: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    creator: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);
contactSchema.plugin(mongoosePaginate);
const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
