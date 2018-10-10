import mongoose, { Schema, mongo } from 'mongoose';

import mongoosePaginate from 'mongoose-paginate';
const itemSchema = new Schema(
  {
    name: String,
    tax: { type: Schema.Types.ObjectId, ref: 'Tax' }
  },
  { timestamps: true }
);

// itemSchema.plugin(mongoosePaginate);
itemSchema.plugin(mongoosePaginate);
const Item = mongoose.model('Item', itemSchema);
export default Item;
