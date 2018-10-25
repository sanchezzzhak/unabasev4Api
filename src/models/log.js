import mongoose, { Schema as _Schema } from 'mongoose';
import mongoosePaginate, { paginate } from 'mongoose-paginate';
let Schema = _Schema;
let AutoIncrement = require('mongoose-sequence')(mongoose);
paginate.options = {
  limit: 15
};

let logSchema = Schema(
  {
    name: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    business: { type: Schema.Types.ObjectId, ref: 'User' },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    module: String,
    ip: String,
    userAgent: String,
    description: String,
    document: { type: Schema.Types.ObjectId },
    documents: Array({ type: Schema.Types.ObjectId }),
    users: Array({ type: Schema.Types.ObjectId, ref: 'User' })
  },
  { timestamps: true }
);

logSchema.index({ '$**': 'text' });

logSchema.plugin(mongoosePaginate);

let Log = mongoose.model('Log', logSchema);

export default Log;
