import mongoose, { Schema, mongo } from 'mongoose';

import mongoosePaginate from 'mongoose-paginate';
const itemSchema = new Schema(
  {
    isActive: { type: Boolean, default: true },
    name: String,
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    quantity: {
      buy: {
        min: { type: Number },
        max: { type: Number }
      },
      sell: {
        min: { type: Number },
        max: { type: Number }
      }
    },
    global: [
      {
        currency: { type: Schema.Types.ObjectId, ref: 'Currency' },
        estimate: {
          buy: {
            lock: { type: Boolean, default: true },
            price: { type: Number }
          },
          sell: {
            lock: { type: Boolean, default: true },
            price: { type: Number }
          },
          cost: {
            lock: { type: Boolean, default: true },
            price: { type: Number }
          }
        },
        tax: Array({ type: Schema.Types.ObjectId, ref: 'Tax' }),
        margin: {
          max: {
            percentage: { type: Number },
            price: { type: Number, default: 0 }
          },
          min: {
            percentage: { type: Number },
            price: { type: Number, default: 0 }
          }
        }
      }
    ],
    price: { type: Number },
    lastPrice: { type: Number }
  },
  { timestamps: true }
);

// itemSchema.plugin(mongoosePaginate);
itemSchema.plugin(mongoosePaginate);
const Item = mongoose.model('Item', itemSchema);
export default Item;
