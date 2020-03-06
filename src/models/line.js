import mongoose from "mongoose";
import Item from "./item";
import Movement from "./movement";
const Schema = mongoose.Schema;

const lineSchema = new Schema(
  {
    name: { type: String, required: true },
    // tax: { type: String, ref: "Tax" }, // deprecated
    observation: { type: String },
    number: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    price: { type: Number },
    taxes: Array({
      tax: { type: String, ref: "Tax" },
      price: { type: Number, default: 0 }
    }),
    numbers: {
      price: { type: Number, default: 0 },
      budget: { type: Number, default: 0 },
      budgetModified: { type: Boolean, default: false },
      cost: { type: Number, default: 0 }, // TODO rename to expense
      tax: { type: Number, default: 0 }
    },
    providers: Array({
      // save the user if the contact created or selected has a user reference.
      user: { type: String, ref: "User" },
      // save the contact id
      contact: { type: String, ref: "Contact" },
      // save the business id if the user has businesses and one of them is selected
      business: { type: String, ref: "Business" }
    }),
    children: Array({ type: String, ref: "Line" }),
    listIndex: Number,
    isParent: { type: Boolean, default: false },
    parent: { type: String, ref: "Line" },
    requestedMovements: Array({ providor: { type: String, ref: "Contact" }, movement: { type: String, ref: "Movement" } }),
    clientLine: { type: String, ref: "Line" },
    expenses: Array({ type: String, ref: "Line" }),
    // item: { type: String, ref: "Item" },
    item: { type: String, ref: "Item" },
    // movement: { type: String, ref: "Movement" },
    movement: { ref: "Movement", type: String },
    comments: Array({ type: String, ref: "Comment" }),
    creator: { type: String, ref: "User" }
  },
  { timestamps: true }
);

lineSchema.methods.saveAsync = function() {
  return new Promise((resolve, reject) => {
    this.save((err, line) => {
      if (err) return reject(err);
      else resolve(line);
    });
  });
};

lineSchema.post("save", function(doc, next) {
  logy("post has been saved++++++++++++++++++++++++");
  if (doc.movement) {
    Movement.findByIdAndUpdate(doc.movement, { $addToSet: { lines: doc.id } }).exec();
  }
  next();
});
lineSchema.pre("save", function(next) {
  logy("pre has been saved++++++++++++++++++++++++");
  next();
});
lineSchema.post("insertMany", function(docs, next) {
  logy("post has been insertManyd++++++++++++++++++++++++");
  logy(docs);

  next();
});
lineSchema.pre("insertMany", async function(next, docs) {
  logy("pre has been insertManyd++++++++++++++++++++++++");
  logy(docs);
  let movement = await Movement.findById(docs[0].movement).exec();
  let currencyString = movement.currency.toString();
  let itemsToUpdate = [];
  docs.forEach(async line => {
    let item = await Item.findById(line.item).exec();

    let currencies = Array.from(item.global.map(i => i.currency.toString()));
    if (!currencies.includes(currencyString)) {
      itemsToUpdate.push(item._id.toString());
      // await Item.findById(line.item, (err, item) => {
      //   item.global.push({
      //     currency: movement.currency
      //   });
      //   item.save();
      // });
    }
    if (itemsToUpdate.length) {
      let global = {
        currency: movement.currency
      };
      Item.update(
        {
          _id: {
            $in: itemsToUpdate
          }
        },
        {
          $push: {
            global: global
          }
        }
      ).exec(() => {
        next(false);
      });
    }
  });
  next();
});
lineSchema.post("update", function(doc, next) {
  logy("post has been updated++++++++++++++++++++++++:::::::::::::::::::::::");
  logy(doc);
  // logy(doc.numbers);
  // logy(doc.name);

  next();
});
lineSchema.pre("update", function(doc, next) {
  logy("pre has been updated++++++++++++++++++++++++:::::::::::::::::::::::");
  logy(doc);

  next();
});
lineSchema.post("find", function(doc, next) {
  logy("lineSchema - post has been findd++++++++++++++++++++++++:::::::::::::::::::::::");

  next();
});
lineSchema.post("findOneAndUpdate", async function(doc, next) {
  // const id = this._conditions._id.toString();
  const modifiedFields = this.getUpdate().$set;

  logy("------");
  logy(modifiedFields);
});

// lineSchema.pre("find", function (doc, next) {
//   logy("lineSchema - pre has been findd++++++++++++++++++++++++:::::::::::::::::::::::");
//   logy(this.getPopulatedPaths());
//   next();
// });

const Line = mongoose.model("Line", lineSchema);

Line.updateParentTotal = parentId => {
  return new Promise((resolve, reject) => {
    Line.find({ parent: parentId }, (err, lines) => {
      if (err) reject(err);
      let priceSum = 0;
      let budgetSum = 0;
      let costSum = 0;
      // for (let line of lines) {
      //   priceSum += line.numbers.price * line.quantity;
      //   budgetSum += line.numbers.budget * line.quantity;
      // }
      priceSum = lines.reduce((prev, curr) => prev + curr.numbers.price * curr.quantity, 0);
      budgetSum = lines.reduce((prev, curr) => prev + curr.numbers.budget * curr.quantity, 0);
      costSum = lines.reduce((prev, curr) => prev + curr.numbers.cost, 0);
      Line.findByIdAndUpdate(
        parentId,
        {
          "numbers.price": priceSum,
          "numbers.budget": budgetSum,
          "numbers.cost": costSum
        },
        {
          new: true
        },
        async (err, parent) => {
          if (err) reject(err);
          if (parent?.parent) await Line.updateParentTotal(parent.parent);

          logy("End of updatePArentTotal/////////////////////////");
          resolve(parent);
        }
      );
    });
  });
};

Line.addParent = (children, parentId) => {
  return new Promise((resolve, reject) => {
    // deprecated for
    // for (let child of children) {
    Line.updateMany(
      {
        _id: {
          $in: children
        }
      },
      {
        parent: parentId
      },
      (err, resp) => {
        if (err) {
          logy(err);
          reject(err);
        } else {
          resolve();
        }
      }
    );
    // }
  });
};
Line.getTreeTotals = movementId => {
  return new Promise((resolve, reject) => {
    Line.find({
      movement: movementId
    })
      .select("parent numbers name isParent observation")
      .exec((err, lines) => {
        if (err) reject(err);
        else resolve(lines);
      });
    // Line.find({ _id: parentId })
    //   .select("parent numbers name children")
    //   .populate({
    //     path: "children",
    //     populate: {
    //       path: "children",
    //       populate: { path: "children", populate: { path: "children", populate: "children" } }
    //     }
    //   })
    //   .exec((err, lines) => {
    //     if (err) reject(err);
    //     else resolve(lines);
    //   });
  });
};

Line.updateManyMod = items => {
  let lines = [];
  let errorLines = [];
  let count = 0;
  let countError = 0;
  let countSuccess = 0;
  return new Promise((resolve, reject) => {
    let check = (items, count) => {
      if (items.length === count) {
        logy("items.length");
        logy(items.length);
        logy("count");
        logy(count);
        resolve({
          lines,
          errorLines
        });
      }
    };
    items.forEach(i => {
      if (i._id) {
        Line.findByIdAndUpdate(
          i._id,
          i,
          {
            new: true
          },
          (err, line) => {
            if (err) {
              errorLines.push({
                _id: i._id,
                error: err
              });
            } else {
              lines.push(line._id);
            }
            count += 1;
            check(items, count);
          }
        );
      } else {
        let newLine = new Line();
        newLine.name = i.name;
        newLine.tax = i.tax;
        newLine.number = i.number;
        newLine.quantity = i.quantity;
        newLine.price = i.price;
        newLine.item = i.item;
        newLine.save((err, line) => {
          if (err) {
            errorLines.push({
              _id: i._id,
              error: err
            });
          } else {
            lines.push(line._id);
          }

          count += 1;
          check(items, count);
        });
      }
    });
  });
};

Line.updateClientLine = id => {
  return new Promise((resolve, reject) => {
    Line.findById(id)
      // .populate("expenses", "numbers quantity")
      .populate({
        path: "expenses",
        select: "numbers quantity movement",
        populate: {
          path: "movement",
          select: "state"
        }
      })
      .exec(async (err, line) => {
        if (err) reject(err);
        let total = line.expenses.reduce((prev, curr) => {
          return curr.movement?.state === "business" ? prev + curr.numbers.price * curr.quantity : 0;
        }, 0);
        line.numbers.cost = total;

        await line.save();
        console.log(`::------------ update client line(${line.name}) cost: ${total}  ------------::::`);
        resolve(line);
        // q.reduce((a,c) => a + (c.n.p * c.q), 0 )
      });
  });
};
export default Line;
