// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const mongoosePaginate = require("mongoose-paginate");
// const User = require('./user');
import User from './user';
import mongoose from 'mongoose';
// const mongoosePaginate = require("mongoose-paginate");
import mongoosePaginate from 'mongoose-paginate';
const Schema = mongoose.Schema;
const incomeSchema = new Schema(
  {
    name: String,
    description: String,
    dates: {
      expiration: Date
    },
    client: { type: Schema.Types.ObjectId, ref: 'User' },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    items: Array({ type: Schema.Types.ObjectId, ref: 'ItemLine' }),
    total: {
      net: Number,
      tax: Number
    },
    state: String,
    isActive: { type: Boolean, default: true },
    currency: {
      type: { type: Schema.Types.ObjectId, ref: 'Currency' }
    }
  },
  { timestamps: true }
);

incomeSchema.plugin(mongoosePaginate);

const Income = mongoose.model('Income', incomeSchema);
export default Income;
