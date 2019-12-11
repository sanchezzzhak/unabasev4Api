import mongoose, { Schema as _Schema, model } from "mongoose";
let Schema = _Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

let accessSchema = Schema({
  name: { type: String, required: true },
  description: String,
  module: String
});
// accessSchema.plugin(AutoIncrement, { inc_field: 'id' });

// let User = module.exports = mongoose.model('User', userSchema);
let Access = (module.exports = model("access", accessSchema));

// let Access = mongoose.model('access', accessSchema);

// module.exports = Access;
