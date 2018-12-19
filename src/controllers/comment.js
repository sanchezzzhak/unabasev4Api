import Comment from '../models/comments';
import Movement from '../models/movement';
import Line from '../models/line';

export const create = (req, res) => {
  let comment = new Comment(req.body);
  comment.creator = req.user._id;
  comment.save((err, item) => {
    if (err) {
      res.status(500).send({ msg: err });
    } else {
      item.populate('creator', 'name google', err => {
        switch (req.body.from.name) {
          case 'movement':
            console.log(req.body.from.name);
            Movement.findOneAndUpdate(
              { _id: req.body.from.id },
              { $addToSet: { comments: item._id } },
              {}
            ).exec();
            break;
          case 'line':
            console.log(req.body.from.name);
            Line.findOneAndUpdate(
              { _id: req.body.from.id },
              { $addToSet: { comments: item._id } },
              {}
            ).exec();
            break;
        }

        res.send(item);
      });
    }
  });
};

export const getFrom = (req, res) => {
  console.log(req.params);
  Comment.find({ 'from.id': req.params.id, 'from.name': req.params.name })
    .populate('creator', 'name google')
    .sort({
      createAt: 'desc'
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
      res.send({ msg: 'comment deleted' });
    }
  });
};
