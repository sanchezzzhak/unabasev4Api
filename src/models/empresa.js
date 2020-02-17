import mongoose, { Schema } from "mongoose";
// import mongoosePaginate from "mongoose-paginate";
import mongoosePaginate from "mongoose-paginate-v2";
import paginateConfig from "../config/paginate";
let empresaSchema = Schema({
  rut: { type: Number },
  dv: { type: String },
  razon_social: { type: String }
});
empresaSchema.index({ rut: 1, razon_social: 1 });
empresaSchema.plugin(mongoosePaginate);

mongoosePaginate.paginate.options = paginateConfig;
const empresa = mongoose.model("Empresa", empresaSchema);
export default empresa;
