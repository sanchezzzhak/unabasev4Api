import mongoose from "mongoose";
const Schema = mongoose.Schema;

const lineSchema = new Schema(
  {
    name: { type: String, required: true },
    tax: { type: Schema.Types.ObjectId, ref: "Tax" },
    number: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    price: { type: Number },
    numbers: {
      price: { type: Number, default: 0 },
      budget: { type: Number, default: 0 },
      cost: { type: Number, default: 0 }
    },
    children: Array({ type: Schema.Types.ObjectId, ref: "Line" }),
    listIndex: Number,
    isParent: { type: Boolean, default: false },
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

lineSchema.post("save", function(doc, next) {
  console.log("post has been saved++++++++++++++++++++++++");

  next();
});
lineSchema.pre("save", function(next) {
  console.log("pre has been saved++++++++++++++++++++++++");
  next();
});
// lineSchema.post("insertMany", function(next, name) {
//   console.log("post has been insertManyd++++++++++++++++++++++++");
//   next();
// });
// lineSchema.pre("insertMany", function(next, name) {
//   console.log("pre has been insertManyd++++++++++++++++++++++++");
//   console.log(name);
//   next();
// });
lineSchema.post("update", function(doc, next) {
  console.log("post has been updated++++++++++++++++++++++++:::::::::::::::::::::::");
  console.log(doc);
  // console.log(doc.numbers);
  // console.log(doc.name);

  next();
});
lineSchema.pre("update", function(doc, next) {
  console.log("pre has been updated++++++++++++++++++++++++:::::::::::::::::::::::");
  console.log(doc);
  // console.log(doc.numbers);
  // console.log(doc.name);

  next();
});
lineSchema.post("find", function(doc, next) {
  console.log("post has been findd++++++++++++++++++++++++:::::::::::::::::::::::");
  // console.log("this");
  // console.log(this.populate("parent"));
  // console.log(this.parent);
  // console.log(this);
  // console.log(doc.numbers);
  // console.log(doc.name);

  next();
});
// lineSchema.pre("find", function(doc, next) {
//   console.log("pre has been findd++++++++++++++++++++++++:::::::::::::::::::::::");
//   console.log("doc");
//   console.log(doc());
//   console.log("next");
//   console.log(next());
//   // console.log("this");
//   // console.log(this);
//   // console.log(doc.numbers);
//   // console.log(doc.name);

//   next();
// });
// lineSchema.methods.updateParentTotal = function(data = null) {
//   if (!data) {
//     let data = [];
//   }
//   return new Promise((resolve, reject) => {
//     // let thisParent = this.parent;
//     this.populate([{ path: "children", select: "numbers" }], err => {
//       let sum = 0;
//       for (let child of this.children) {
//         sum += child.numbers.price;
//       }
//       this.numbers.price = sum;

//       this.save((err, newLine) => {
//         if (err) return reject(err);
//         else {
//           data.push({
//             _id: newLine._id,
//             parent: newLine.parent,
//             numbers: newLine.numbers
//           });
//           if (newLine.parent) {
//             Line.findById(newLine.parent, (err, line) => {
//               if (err) return reject(err);
//               else if (line) {
//                 line.updateParentTotal(data);
//               }
//             });
//           } else {
//             resolve(data);
//           }
//         }
//       });
//     });
//   });
// };

const Line = mongoose.model("Line", lineSchema);

Line.updateParentTotal = (parentId, callback) => {
  Line.find({ parent: parentId }, (err, lines) => {
    if (err) {
      callback(err);
    } else {
      let sum = 0;
      for (let line of lines) {
        sum += line.numbers.price;
      }
      Line.findByIdAndUpdate(parentId.toString(), { "numbers.price": sum }, { new: true }, (err, parent) => {
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
      });
    }
  });
};

Line.addParent = (children, parentId) => {
  return new Promise((resolve, reject) => {
    for (let child of children) {
      Line.updateMany(
        { _id: { $in: children } },
        {
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
    }
  });
};
Line.getTreeTotals = movementId => {
  return new Promise((resolve, reject) => {
    Line.find({ movement: movementId })
      .select("parent numbers name")
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
