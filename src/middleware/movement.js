import Comments from "../models/comments";
import Movement from "../models/movement";

import { Types } from "mongoose";
import Line from "../models/line";
const ObjectId = Types.ObjectId;
export function updateSuccessPercentage(comment) {
  const from = comment.from;
  if (from.name === "movement") {
    logy(`update success % of movement ${from.name} // ${from.id}`);
    Comments.find({ "from.id": from.id, value: { $exists: 1 } }, (err, comments) => {
      if (err) {
        logy(err);
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
