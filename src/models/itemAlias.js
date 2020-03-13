import mongoose, { Schema } from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";
import paginateConfig from "../config/paginate";

const itemAliasSchema = Schema({
  name: { type: String },
  item: { type: String, ref: "Item" },
  creator: { type: String, ref: "User" }
});
itemAliasSchema.plugin(mongoosePaginate);
mongoosePaginate.paginate.options = paginateConfig;
const ItemAlias = mongoose.model("ItemAlias", itemAliasSchema);

export default ItemAlias;
