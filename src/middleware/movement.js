import Comments from "../models/comments";
import Movement from "../models/movement";

import { Types } from "mongoose";
const ObjectId = Types.ObjectId;
export function updateSuccessPercentage(comment) {
  const from = comment.from;
  if (from.name === "movement") {
    Comments.find({ "from.id": ObjectId(`${from.id}`), value: { $exists: 1 } }, (err, comments) => {
      if (err) {
        console.log(err);
      } else {
        const arraySum = array => array.reduce((a, b) => a + b, 0);
        let valueArray = comments.map(comment => comment.value);
        const successPercentage = Math.round(arraySum(valueArray) / (valueArray.length / 100));
        Movement.findByIdAndUpdate(comment.from.id, { successPercentage }).exec();
      }
    });
  }
}
