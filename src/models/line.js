import mongoose from "mongoose";
const Schema = mongoose.Schema;

const lineSchema = new Schema(
  {
    name: { type: String, required: true },
    tax: { type: Schema.Types.ObjectId, ref: "Tax" },
    number: { type: Number, default: 0 },
    quantity: { type: Number },
    price: { type: Number },
    numbers: {
      price: Number,
      budget: Number,
      cost: Number
    },
    children: Array({ type: Schema.Types.ObjectId, ref: "Line" }),
    listIndex: Number,
    parent: { type: Schema.Types.ObjectId, ref: "Line" },

    // quantity: Array({}),

    item: { type: Schema.Types.ObjectId, ref: "Item" },
    movement: { type: Schema.Types.ObjectId, ref: "Movement" },
    comments: Array({ type: Schema.Types.ObjectId, ref: "Comment" }),
    creator: { type: Schema.Types.ObjectId, ref: "User" }
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
lineSchema.methods.updateParentTotal = function() {
  return new Promise((resolve, reject) => {
    // let thisParent = this.parent;
    this.populate([{ path: "children", select: "numbers" }], err => {
      let sum = 0;
      for (let child of this.children) {
        sum += child.numbers.price;
      }
      this.numbers.price = sum;

      this.save((err, newLine) => {
        if (err) return reject(err);
        else {
          if (newLine.parent) {
            Line.findById(newLine.parent, (err, line) => {
              if (err) return reject(err);
              else if (line) {
                line.updateParentTotal();
              }
            });
          } else {
            resolve();
          }
        }
      });
    });
  });
};

const Line = mongoose.model("Line", lineSchema);

Line.getTreeTotals = movementId => {
  return new Promise((resolve, reject) => {
    Line.find({ movement: movementId })
      // .populate({'item', 'lastPrice global'})
      .populate([
        {
          path: "children",
          select: "parent numbers",
          populate: [
            {
              path: "children",
              select: "parent numbers",
              populate: [
                {
                  path: "children",
                  select: "parent numbers",
                  populate: [{ path: "children", select: "parent numbers", populate: "children" }]
                }
              ]
            }
          ]
        }
      ])
      .exec((err, lines) => {
        if (err) reject(err);
        else resolve(lines);
      });
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
        Line.findByIdAndUpdate(i._id, i, { new: true }, (err, line) => {
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
