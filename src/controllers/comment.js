import Comment from '../models/comments';

export const create = (req, res) => {
  let comment = new Comment(req.body);
  comment.save((err, item) => {
    if (err) {
      res.status(500).send({ msg: err });
    } else {
      res.send(item);
    }
  });
};

export const getFrom = (req, res) => {
  Comment.find({ id: req.params.id, name: req.params.name }, (err, items) => {
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
