import Comments from "../models/comments";
import Movement from "../models/movement";

import { Types } from "mongoose";
const ObjectId = Types.ObjectId;
export function updateSuccessPercentage(comment) {
  const from = comment.from;
  if (from.name === "movement") {
    console.log(`update success % of movement ${from.name} // ${from.id}`);
    Comments.find({ "from.id": ObjectId(`${from.id}`), value: { $exists: 1 } }, (err, comments) => {
      if (err) {
        console.log(err);
      } else {
        const arraySum = array => array.reduce((a, b) => a + b, 0);
        let valueArray = comments.map(comment => comment.value);
        let successPercentage = Math.round(arraySum(valueArray) / (valueArray.length / 100));
        successPercentage = successPercentage >= 0 ? successPercentage : 0;
        Movement.findByIdAndUpdate(comment.from.id, { successPercentage }).exec();
      }
    });
  }
}

export function createContact() {
  if (req.body.client._id) {
  }
}
