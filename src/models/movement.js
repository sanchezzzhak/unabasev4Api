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
    lines: Array({ type: Schema.Types.ObjectId, ref: 'Line' }),
    total: {
      net: Number,
      tax: Number
    },
    state: String,
    isActive: { type: Boolean, default: true },
    currency: { type: Schema.Types.ObjectId, ref: 'Currency' }
  },
  { timestamps: true }
);

movementSchema.plugin(mongoosePaginate);

const Movement = mongoose.model('Movement', movementSchema);
export default Movement;
