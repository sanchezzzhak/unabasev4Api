import Line from "../models/line";
import Movement from "../models/movement";
import Item from "../models/item";
import { asyncForEach } from "./asyncForEach";

export const checkGlobal = async movementId => {
  let movement = await Movement.findById(movementId).exec();
  let currencyString = movement.currency.toString();
  // new Promise((resolve, reject) => {
  Line.find({ movement: movement._id })
    .populate("item")
    .exec(async (err, lines) => {
      if (err) {
        console.log(err);
      } else {
        let currencies;
        await asyncForEach(lines, async line => {
          currencies = Array.from(line.item.global.map(i => i.currency.toString()));
          if (!currencies.includes(currencyString)) {
            await Item.findById(line.item, (err, item) => {
              item.global.push({
                currency: movement.currency
              });
              item.save();
            });
          }
        });
        // lines.forEach(line => {
        //   let currencies = Array.from(line.item.global.map(i => i.currency.toString()));
        //   console.log("-----------------------currency from movement");
        //   console.log(currencyString);
        //   console.log("-----------------------currency from global");
        //   console.log(currencies.includes(currencyString));
        //   console.log(currencies);
        //   if (!currencies.includes(currencyString)) {
        //     Item.findById(line.item, (err, item) => {
        //       item.global.push({
        //         currency: movement.currency
        //       });
        //       item.save();
        //     });
        //   }
        // });
      }
    });
};
