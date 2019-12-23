import mongoose from "mongoose";
import Item from "./item";
import Movement from "./movement";
const Schema = mongoose.Schema;

const lineSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  tax: {
    type: Schema.Types.ObjectId,
    ref: "Tax"
  },
  observation: {
    type: String
  },
  number: {
    type: Number,
    default: 0
  },
  quantity: {
    type: Number,
    default: 1
  },
  price: {
    type: Number
  },
  taxes: Array({
    tax: {
      type: Schema.Types.ObjectId,
      ref: "Tax"
    },
    price: {
      type: Number,
      default: 0
    }
  }),
  numbers: {
    price: {
      type: Number,
      default: 0
    },
    budget: {
      type: Number,
      default: 0
    },
    budgetModified: {
      type: Boolean,
      default: false
    },
    cost: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    }
  },
  children: Array({
    type: Schema.Types.ObjectId,
    ref: "Line"
  }),
  listIndex: Number,
  isParent: {
    type: Boolean,
    default: false
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "Line"
  },

  // quantity: Array({}),

  item: {
    type: Schema.Types.ObjectId,
    ref: "Item"
  },
  movement: {
    type: Schema.Types.ObjectId,
    ref: "Movement"
  },
  comments: Array({
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }),
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});

lineSchema.methods.saveAsync = function () {
  return new Promise((resolve, reject) => {
    this.save((err, line) => {
      if (err) return reject(err);
      else resolve(line);
    });
  });
};

lineSchema.post("save", function (doc, next) {
  console.log("post has been saved++++++++++++++++++++++++");

  next();
});
lineSchema.pre("save", function (next) {
  console.log("pre has been saved++++++++++++++++++++++++");
  next();
});
lineSchema.post("insertMany", function (docs, next) {
  console.log("post has been insertManyd++++++++++++++++++++++++");
  console.log(docs);

  next();
});
lineSchema.pre("insertMany", async function (next, docs) {
  console.log("pre has been insertManyd++++++++++++++++++++++++");
  console.log(docs);
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
      Item.update({
        _id: {
          $in: itemsToUpdate
        }
      }, {
        $push: {
          global: global
        }
      }).exec(() => {
        next(false);
      });
    }
  });
  next();
});
lineSchema.post("update", function (doc, next) {
  console.log("post has been updated++++++++++++++++++++++++:::::::::::::::::::::::");
  console.log(doc);
  // console.log(doc.numbers);
  // console.log(doc.name);

  next();
});
lineSchema.pre("update", function (doc, next) {
  console.log("pre has been updated++++++++++++++++++++++++:::::::::::::::::::::::");
  console.log(doc);

  next();
});
lineSchema.post("find", function (doc, next) {
  console.log("lineSchema - post has been findd++++++++++++++++++++++++:::::::::::::::::::::::");
  next();
});

// lineSchema.pre("find", function (doc, next) {
//   console.log("lineSchema - pre has been findd++++++++++++++++++++++++:::::::::::::::::::::::");
//   console.log(this.getPopulatedPaths());
//   return next();
// });

const Line = mongoose.model("Line", lineSchema);

Line.updateParentTotal = (parentId, callback) => {
  Line.find({
      parent: parentId
    },
    (err, lines) => {
      if (err) {
        callback(err);
      } else {
        let priceSum = 0;
        let budgetSum = 0;
        for (let line of lines) {
          priceSum += line.numbers.price * line.quantity;
          budgetSum += line.numbers.budget * line.quantity;
        }
        Line.findByIdAndUpdate(
          parentId.toString(), {
            "numbers.price": priceSum,
            "numbers.budget": budgetSum
          }, {
            new: true
          },
          (err, parent) => {
            if (err) {
              callback(err);
            } else {
              if (parent.parent) {
                Line.updateParentTotal(parent.parent, callback);
              } else {
                console.log("End of updatePArentTotal/////////////////////////");
                if (callback) callback(null, parent);
              }
            }
          }
        );
      }
    }
  );
};

Line.addParent = (children, parentId) => {
  return new Promise((resolve, reject) => {
    // deprecated for
    // for (let child of children) {
    Line.updateMany({
        _id: {
          $in: children
        }
      }, {
        parent: parentId
      },
      (err, resp) => {
        if (err) {
          console.log(err);
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
        console.log("items.length");
        console.log(items.length);
        console.log("count");
        console.log(count);
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
          i, {
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
export default Line;