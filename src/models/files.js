import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import paginateConfig from "../config/paginate";
const filesSchema = Schema(
    {
        name: { type: String },
        tag: { type: String },
        type: { type: String },
        ext: { type: String },
        user: { type: String, ref: "User" },
        internalPath: { type: String },
        bucketName: { type: String },
        url: { type: String },
        size: { type: Number }
    },
    { timestamps: true }
);

filesSchema.plugin(mongoosePaginate);

mongoosePaginate.paginate.options = paginateConfig;

const Files = mongoose.model("Files", filesSchema);

export default Files;
