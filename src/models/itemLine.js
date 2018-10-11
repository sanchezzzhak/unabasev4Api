import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const itemLineSchema = new Schema(
  {
    name: { type: String, required: true },
    tax: { type: Schema.Types.ObjectId, ref: 'Tax' },
    quantity: { type: Number },
    price: { type: Number },
    item: { type: Schema.Types.ObjectId, ref: 'Item' },
    income: { type: Schema.Types.ObjectId, ref: 'Income' }
  },
  { timestamps: true }
);

itemLineSchema.methods.saveAsync = function() {
  return new Promise((resolve, reject) => {
    this.save((err, line) => {
      if (err) return reject(err);
      else resolve(line);
    });
  });
};

const ItemLine = mongoose.model('ItemLine', itemLineSchema);
export default ItemLine;
