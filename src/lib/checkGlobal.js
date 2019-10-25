import Line from "../models/line";
import Movement from "../models/movement";
import Item from "../models/item";

export const checkGlobal = async movementId => {
  let movement = await Movement.findById(movementId).exec();
  // new Promise((resolve, reject) => {
  Line.find({ movement: movement._id })
    .populate("item")
    .exec((err, lines) => {
      if (err) {
        console.log(err);
      } else {
        // let itemsIds = lines.map(line => line._id);
        // Item.find({ _id: { $in: itemsIds } });
        lines.forEach(line => {
          // if (!line.item.currency.equals(movement.currency) && line.item.currency.global.map(i => i.currency.equals(movement.currency)).length === 0) {
          let currencies = line.item.global.map(i => i.currency);
          console.log("-----------------------currency from movement");
          console.log(movement.currency.toString());
          console.log("-----------------------currency from global");
          console.log(currencies.includes(movement.currency));
          if (!currencies.includes(movement.currency)) {
            Item.findById(line.item, (err, item) => {
              item.global.push({
                currency: movement.currency
              });
              item.save();
            });
          }
        });
      }
    });
  // });
};
