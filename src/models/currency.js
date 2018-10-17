import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;

const currencySchema = new Schema(
  {
    name: String,
    decimal: { type: String, enum: [',', '.'] },
    thousand: { type: String, enum: [',', '.'] },
    prefix: String,
    suffix: String,
    precision: { type: Number, min: 0, max: 10 }
  },
  { timestamps: true }
);

currencySchema.plugin(mongoosePaginate);

const Currency = mongoose.model('Currency', currencySchema);
export default Currency;
