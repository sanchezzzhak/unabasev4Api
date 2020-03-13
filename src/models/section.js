import mongoose, { Schema } from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";
import paginateConfig from "../config/paginate";

const sectionSchema = Schema(
  {
    name: { type: String },
    users: Array({ type: String, ref: "User" })
  },
  { timestamps: true }
);
