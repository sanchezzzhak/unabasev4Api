import Comment from "../models/comments";
import Movement from "../models/movement";
import Line from "../models/line";

export const create = (req, res) => {
  let comment = new Comment(req.body);
  comment.creator = req.user._id;
  comment.save((err, item) => {
    if (err) {
      res.status(500).send({ msg: err });
    } else {
      item.populate("creator", "name imgUrl", err => {
        if (err) {
          res.status(500).send({ msg: err });
        } else {
          res.send(item);
        }
      });
    }
  });
};
export const updateOne = (req, res) => {
  Comment.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, comment) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(comment);
    }
  });
};

export const getFrom = (req, res) => {
  console.log(req.params);
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
