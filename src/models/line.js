import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const lineSchema = new Schema(
  {
    name: { type: String, required: true },
    tax: { type: Schema.Types.ObjectId, ref: 'Tax' },
    number: { type: Number, default: 0 },
    quantity: { type: Number },
    price: { type: Number },
    item: { type: Schema.Types.ObjectId, ref: 'Item' },
    movement: { type: Schema.Types.ObjectId, ref: 'Movement' },
    comments: Array({ type: Schema.Types.ObjectId, ref: 'Comment' }),
    creator: { type: Schema.Types.ObjectId, ref: 'User' }
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

const Line = mongoose.model('Line', lineSchema);

Line.updateManyMod = items => {
  let lines = [];
  let errorLines = [];
  let count = 0;
  let countError = 0;
  let countSuccess = 0;
  return new Promise((resolve, reject) => {
    let check = (items, count) => {
      if (items.length === count) {
        console.log('items.length');
        console.log(items.length);
        console.log('count');
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
