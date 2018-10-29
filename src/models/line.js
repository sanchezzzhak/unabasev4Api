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
    movement: { type: Schema.Types.ObjectId, ref: 'Movement' }
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
export default Line;
