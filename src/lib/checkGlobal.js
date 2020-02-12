import Line from "../models/line";
import Movement from "../models/movement";
import Item from "../models/item";
import { asyncForEach } from "./asyncForEach";

export const checkGlobal = async movementId => {
  let movement = await Movement.findById(movementId).exec();
  let currencyString = movement.currency.toString();
  // new Promise((resolve, reject) => {
  return new Promise((resolve, reject) => {
    Line.find({ movement: movement._id })
      .populate("item")
      .exec(async (err, lines) => {
        if (err) {
          logy(err);
          reject(err);
        } else {
          let currencies;
          for await (let line of lines) {
            currencies = Array.from(line.item.global.map(i => i.currency.toString()));
            let thi = 0;
            if (!currencies.includes(currencyString)) {
              await Item.findById(line.item, (err, item) => {
                item.global.push({
                  currency: movement.currency
                });
                item.save();
              });
            }
          }
          resolve(true);
        }
      });
  });
};
