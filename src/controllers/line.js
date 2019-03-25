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
  let movementType = req.body.movementType === 'income' ? 'sell' : 'buy';
  let currency = req.body.currency;
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

      // let global = {
      //   currency,
      //   lastPrice: {
      //     [movementType]: line.price
      //   }
      // };
      console.log('////////////////////////////');
      console.log(global);
      console.log('////////////////////////////');
      console.log(req.body.movementType);
      Item.findOne({ 'global.currency': currency }).exec((err, item) => {
        if (err) {
          res.status(500).send(err);
        } else {
          let index = item.global.map(i => i.currency).indexOf(currency);
          item.global[index].lastPrice[movementType] = line.price;
          item.save((err, newItem) => {
            if (err) {
              res.status(500).send(err);
            } else {
              line.item = newItem;
              res.send(line);
            }
          });
        }
      });
    }
  });
}

export function updateOne(req, res) {
  let movementType = req.body.movementType === 'income' ? 'sell' : 'buy';
  let currency = req.body.currency;
  Line.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, line) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else if (line) {
        let global = {
          currency,
          lastPrice: {
            [movementType]: line.price
          }
        };
        console.log('////////////////////////////');
        console.log(global);
        console.log('////////////////////////////');
        console.log(req.body.movementType);
        Item.findByIdAndUpdate(
          line.item,
          { $set: { global } },
          { new: true }
        ).exec();
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
