import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate";

let empresaSchema = Schema({
  rut: { type: Number },
  dv: { type: String },
  razon_social: { type: String }
});

empresaSchema.plugin(mongoosePaginate);

const empresa = mongoose.model("Empresa", empresaSchema);
export default empresa;
