import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    from: {
      id: { type: Schema.Types.ObjectId },
      name: { type: String }
    },
    text: { type: String, maxlength: 2000 },
    sub: { type: Schema.Types.ObjectId, ref: 'Comment' },
    users: Array({ type: Schema.Types.ObjectId, ref: 'User' })
  },
  { timestamps: true }
);

const Comments = mongoose.model('Comment', commentSchema);

export default Comments;
