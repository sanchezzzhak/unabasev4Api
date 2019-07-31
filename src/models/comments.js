import mongoose from "mongoose";
const Schema = mongoose.Schema;

import { updateSuccessPercentage } from "../middleware/movement";

const commentSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    from: {
      id: { type: Schema.Types.ObjectId, refPath: "from.name" },
      name: { type: String }
    },
    schedule: { type: Date },
    isPrivate: { type: Boolean },
    text: { type: String, maxlength: 2000 },
    parent: { type: Schema.Types.ObjectId, ref: "Comment" },
    users: Array({ type: Schema.Types.ObjectId, ref: "User" }),
    value: { type: Number, enum: [1, 0, -1] },
    type: { type: String, enum: ["call", "meeting", "email", "task", "schedule"] }
  },
  { timestamps: true }
);

commentSchema.post("update", function(doc, next) {
  console.log("commentSchema post has been updated++++++++++++++++++++++++:::::::::::::::::::::::");
  console.log(doc);
  // console.log(doc.numbers);
  // console.log(doc.name);

  next();
});
commentSchema.pre("update", function(doc, next) {
  console.log("commentSchema pre has been updated++++++++++++++++++++++++:::::::::::::::::::::::");
  console.log(doc);

  next();
});

commentSchema.post("save", function(doc, next) {
  console.log("commentSchema post has been saved++++++++++++++++++++++++");
  updateSuccessPercentage(doc);

  next();
});
commentSchema.pre("save", function(next) {
  console.log("commentSchema pre has been saved++++++++++++++++++++++++");
  next();
});

commentSchema.post("find", function(doc, next) {
  console.log("commentSchema post has been findd++++++++++++++++++++++++:::::::::::::::::::::::");

  next();
});

const Comments = mongoose.model("Comment", commentSchema);
export default Comments;
