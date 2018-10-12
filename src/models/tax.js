import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const taxSchema = new Schema(
  {
    name: String,
    number: { type: Number, default: 0 }
  },
  { timestamps: true }
);

taxSchema.plugin(mongoosePaginate);
const Tax = mongoose.model('Tax', taxSchema);

export default Tax;
