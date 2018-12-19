import User from './user';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;
const movementSchema = new Schema(
  {
    name: String,
    description: String,
    dates: {
      expiration: Date
    },
    client: { type: Schema.Types.ObjectId, ref: 'User' },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    responsable: { type: Schema.Types.ObjectId, ref: 'User' },
    personal: {
      client: { type: Schema.Types.ObjectId, ref: 'User' },
      responsable: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    business: {
      client: { type: Schema.Types.ObjectId, ref: 'Business' },
      provider: { type: Schema.Types.ObjectId, ref: 'Business' }
    },
    isBusiness: { type: Boolean, default: false },
    lines: Array({ type: Schema.Types.ObjectId, ref: 'Line' }),
    comments: Array({ type: Schema.Types.ObjectId, ref: 'Comment' }),
    total: {
      net: { type: Number, default: 0 },
      tax: { type: Number, default: 0 }
    },
    state: { type: String, default: 'draft' },
    isActive: { type: Boolean, default: true },
    currency: { type: Schema.Types.ObjectId, ref: 'Currency' },
    contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
    contactName: { type: String }
  },
  { timestamps: true }
);

movementSchema.plugin(mongoosePaginate);

const Movement = mongoose.model('Movement', movementSchema);
export default Movement;
