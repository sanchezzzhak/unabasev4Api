import mongoose, { Schema, mongo } from 'mongoose';

import mongoosePaginate from 'mongoose-paginate';
const itemSchema = new Schema(
  {
    isActive: { type: Boolean, default: true },
    name: String,
    tax: Array({ type: Schema.Types.ObjectId, ref: 'Tax' }),
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    quantity: { type: Number },
    estimate: {
      buy: {
        lock: { type: Boolean, default: false },
        price: { type: Number }
      },
      sell: {
        lock: { type: Boolean, default: false },
        price: { type: Number }
      }
    },
    margin: {
      max: {
        percentage: { type: Number },
        price: { type: Number }
      },
      min: {
        percentage: { type: Number },
        price: { type: Number }
      }
    },
    price: { type: Number },
    lastPrice: { type: Number }
  },
  { timestamps: true }
);

// itemSchema.plugin(mongoosePaginate);
itemSchema.plugin(mongoosePaginate);
const Item = mongoose.model('Item', itemSchema);
export default Item;
