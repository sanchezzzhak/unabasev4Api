import Comment from "../models/comments";
import Movement from "../models/movement";
import Line from "../models/line";

export const create = (req, res) => {
  let comment = new Comment(req.body);
  comment.creator = req.user._id;
  comment.save((err, comment) => {
    if (err) {
      res.status(500).send({ msg: err });
    } else {
      comment.populate("creator", "name imgUrl", async err => {
        if (err) {
          res.status(500).send({ msg: err });
        } else {
          let comments = await Comments.find({ "from.id": comment.from.id, value: { $exists: 1 } }).exec();
          const arraySum = array => array.reduce((a, b) => a + b, 0);
          let values = comments.map(comment => comment.value);
          let successPercentage = Math.round(arraySum(values) / (values.length / 100));
          successPercentage = successPercentage >= 0 ? successPercentage : 0;
          let movement = await Movement.findByIdAndUpdate(comment.from.id, { successPercentage }, { select: "successPercentage" }).exec();
          res.send({ comment, movement });
        }
      });
    }
  });
};
export const updateOne = (req, res) => {
  Comment.findByIdAndUpdate(req.params.id, req.body, { new: true }, async (err, comment) => {
    if (err) {
      logy(err);
      res.status(500).send(err);
    } else {
      let comments = await Comments.find({ "from.id": comment.from.id, value: { $exists: 1 } }).exec();
      const arraySum = array => array.reduce((a, b) => a + b, 0);
      let values = comments.map(comment => comment.value);
      let successPercentage = Math.round(arraySum(values) / (values.length / 100));
      successPercentage = successPercentage >= 0 ? successPercentage : 0;
      let movement = await Movement.findByIdAndUpdate(comment.from.id, { successPercentage }, { select: "successPercentage" }).exec();
      res.send({ comment, movement });
    }
  });
};

export const getFrom = (req, res) => {
  logy(req.params);
  Comment.find({ "from.id": req.params.id, "from.name": req.params.name })
    .populate("creator", "name imgUrl")
    .sort({
      createdAt: "desc"
    })
    .exec((err, items) => {
      if (err) {
        res.status(500).send({ msg: err });
      } else {
        res.send(items);
      }
    });
};

export const deleteOne = (req, res) => {
  Comment.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.status(500).send({ msg: err });
    } else {
      res.send({ msg: "comment deleted" });
    }
  });
};
