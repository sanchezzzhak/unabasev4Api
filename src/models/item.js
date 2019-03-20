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
            min: { type: Number },
            max: { type: Number },
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
          },
          sell: {
            lock: { type: Boolean, default: true },
            min: { type: Number },
            max: { type: Number },
            margin: {
              max: {
                percentage: { type: Number },
                price: { type: Number, default: 0 }
              },
              min: {
                percentage: { type: Number },
                price: { type: Number, default: 0 }
              }
            },
          }
        },
        tax: Array({ type: Schema.Types.ObjectId, ref: 'Tax' }),

        lastPrice: {
          buy: { type: Number },
          sell: { type: Number }
        }
      }
    ]
  },
  { timestamps: true }
);

// itemSchema.plugin(mongoosePaginate);
itemSchema.plugin(mongoosePaginate);
const Item = mongoose.model('Item', itemSchema);
export default Item;
