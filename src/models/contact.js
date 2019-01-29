import mongoose from 'mongoose';

import mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    isActive: { type: Boolean, default: true },
    name: String,
    email: String,
    phone: String,
    type: { type: String, enum: ['Business', 'User'] },
    link: { type: Schema.Types.ObjectId, refPath: 'type' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    business: { type: Schema.Types.ObjectId, ref: 'Business' },
    creator: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);
contactSchema.plugin(mongoosePaginate);
const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
