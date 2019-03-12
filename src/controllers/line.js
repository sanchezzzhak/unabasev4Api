import Line from '../models/line';
import Movement from '../models/movement';
import Item from '../models/item';

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
  let movementType = req.body.movementType;
  line.creator = req.user._id;
  line.save((err, line) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (line.movement) {
        Movement.findByIdAndUpdate(
          line.movement,
          { $addToSet: { lines: line._id } },
          {},
          (err, movement) => {
            if (err) console.log(err);
          }
        );
      }

      let lastPrice = {
        [req.body.movementType]: line.price
      };
      Item.findByIdAndUpdate(line.item, lastPrice, { new: true }).exec();
      res.send(line);
    }
  });
}

export function updateOne(req, res) {
  Line.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, line) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        let lastPrice = {
          [req.body.movementType]: line.price
        };
        Item.findByIdAndUpdate(line.item, lastPrice, { new: true }).exec();
        res.send(line);
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
