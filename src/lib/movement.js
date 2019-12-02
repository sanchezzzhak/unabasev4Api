import Movement from "../models/movement";
import Line from "../models/line";

export const calculateTotalMovement = id => {
  return new Promise(async (resolve, reject) => {
    // Movement.findById(id).exec(async (err, movement) => {
    //   if (err) {
    //     reject(err);
    //   } else {

    //   }
    // });
    let lines = await Line.find({ movement: id })
      .populate([{ path: "taxes.tax" }])
      .exec();
    let total = {
      net: 0,
      budget: 0,
      tax: {
        total: 0,
        detail: []
      }
    };
    lines.map(line => {
      total.net += line.quantity * line.numbers.price;
      total.budget += line.quantity * line.numbers.budget;
      line.taxes.forEach(tax => {
        total.tax.total += tax.price;
        total.tax.detail.push({
          name: tax.name,
          number: tax.number
        });
      });
    });
    total.profit = {
      number: total.net - total.budget,
      percentage: 100 - [total.budget / (total.net / 100)]
    };
    resolve({
      movement: {
        total
      }
    });
  });
};
