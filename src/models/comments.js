import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    from: {
      id: { type: Schema.Types.ObjectId, refPath: "from.name" },
      name: { type: String }
    },
    isPrivate: { type: Boolean },
    text: { type: String, maxlength: 2000 },
    parent: { type: Schema.Types.ObjectId, ref: "Comment" },
    users: Array({ type: Schema.Types.ObjectId, ref: "User" }),
    value: { type: Number, enum: [1, 0, -1] },
    type: { type: String, enum: ["call", "meeting", "email", "task", "schedule"] }
  },
  { timestamps: true }
);

const Comments = mongoose.model("Comment", commentSchema);

export default Comments;
