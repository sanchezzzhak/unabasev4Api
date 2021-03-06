import mongoose, { Schema, mongo } from "mongoose";

// import mongoosePaginate from "mongoose-paginate";
import mongoosePaginate from "mongoose-paginate-v2";
import paginateConfig from "../config/paginate";
const itemSchema = new Schema(
  {
    isActive: { type: Boolean, default: true },
    children: Array({ type: String, ref: "Item" }),
    verified: { type: Boolean, default: false },
    name: String,
    creator: { type: String, ref: "User" },
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
    isParent: { type: Boolean, default: false },
    parent: { type: String, ref: "Item" },
    margin: {
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
        currency: { type: String, ref: "Currency" },
        estimate: {
          buy: {
            price: {
              isActive: { type: Boolean },
              number: { type: Number }
            },
            min: {
              number: { type: Number },
              percentage: { type: Number },
              isActive: { type: Boolean }
            },
            max: {
              number: { type: Number },
              percentage: { type: Number },
              isActive: { type: Boolean }
            },
            isActive: { type: Boolean }
          },
          sell: {
            price: {
              isActive: { type: Boolean },
              number: { type: Number }
            },
            min: {
              number: { type: Number },
              percentage: { type: Number },
              isActive: { type: Boolean }
            },
            max: {
              number: { type: Number },
              percentage: { type: Number },
              isActive: { type: Boolean }
            },
            isActive: { type: Boolean }
          },
          margin: {
            isActive: { type: Boolean },
            from: {
              type: String,
              enum: ["buy", "sell"],
              default: "sell"
            },
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
        taxes: Array({ type: String, ref: "Tax" }),

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

mongoosePaginate.paginate.options = paginateConfig;
const Item = mongoose.model("Item", itemSchema);
Item.updateLastPrice = (id, currency, movementType, priceToAdd) => {
  return new Promise((resolve, reject) => {
    let _currency = currency;

    Item.findById(id, (err, item) => {
      if (err) {
        logy("err from update last price");
        logy(err);
        reject(err);
      } else if (item) {
        if (item.global.length) {
          let currencies = item.global.map(i => i.currency.toString());
          let index = currencies.indexOf(_currency);
          if (index >= 0) {
            item.global[index].lastPrice[movementType] = priceToAdd;
            item.save();
          } else {
            item.global.push({
              currency: _currency,
              lastPrice: {
                [movementType]: priceToAdd
              }
            });
            item.save();
          }
        }
        resolve();
      } else {
        reject({ msg: "Item not found" });
      }
    });
  });
};

Item.getWithChildren = docs => {
  return new Promise((resolve, reject) => {
    Item.find({ parent: { $in: docs } }, (err, allChildren) => {
      if (err) {
        reject(err);
      }
      let items = [];
      for (let doc of docs) {
        doc.children = allChildren.filter(child => child.parent == doc._id.toString());
        items.push(doc);
      }
      resolve(items);
    });
  });
};
export default Item;
