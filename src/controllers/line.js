import Line from '../models/line';
import Movement from '../models/movement';

export function get(req, res) {
  let rquery = ntype(req.query);
  let options = {};
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;

  options.populate = [{ path: 'tax' }, { path: 'item' }];
  delete rquery.page;
  delete rquery.limit;
  let query = {
    ...rquery
  };
  console.log('query');
  console.log(query);
  Line.paginate(query, options, (err, items) => {
    if (err) {
      res.status(500).end();
    } else {
      res.json(items);
    }
  });
}
export function create(req, res) {
  let line = new Line(req.body);
  line.save((err, item) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (item.movement) {
        Movement.findByIdAndUpdate(
          item.movement,
          { $addToSet: { lines: item._id } },
          {},
          (err, movement) => {
            if (err) console.log(err);
          }
        );
      }
      res.send(item);
    }
  });
}

export function updateOne(req, res) {
  Line.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, item) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.send(item);
      }
    }
  );
}

export function deleteOne(req, res) {
  Line.findByIdAndRemove(req.params.id, (err, item) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(item);
    }
  });
}
