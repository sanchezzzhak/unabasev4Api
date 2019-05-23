import mongoose, { Schema, mongo } from "mongoose";

import mongoosePaginate from "mongoose-paginate";
const itemSchema = new Schema(
  {
    isActive: { type: Boolean, default: true },
    name: String,
    creator: { type: Schema.Types.ObjectId, ref: "User" },
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
        currency: { type: Schema.Types.ObjectId, ref: "Currency" },
        estimate: {
          buy: {
            lock: { type: Boolean, default: true },
            min: { type: Number },
            max: { type: Number },
            price: { type: Number },
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
            price: { type: Number },
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
        },
        tax: Array({ type: Schema.Types.ObjectId, ref: "Tax" }),

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
const Item = mongoose.model("Item", itemSchema);
Item.updateLastPrice = (id, currency, movementType, princeToAdd) => {
  return new Promise((resolve, reject) => {
    let _currency = currency;

    Item.findById(id, (err, item) => {
      if (err) {
        reject(err);
      } else if (item) {
        if (item.global.length) {
          let currencies = item.global.map(i => i.currency.toString());
          let index = currencies.indexOf(_currency);

          item.global[index].lastPrice[movementType] = princeToAdd;
          item.save();
          resolve();
        }
      } else {
        reject({ msg: "Item not found" });
      }
    });
  });
};
export default Item;
