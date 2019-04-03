import Line from '../models/line';
import Movement from '../models/movement';
import Item from '../models/item';

import { Types } from 'mongoose';
const ObjectId = Types.ObjectId;

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
export function createMany(req, res) {
  let movementType = req.params.movementType === 'income' ? 'sell' : 'buy';
  Line.insertMany(req.body, (err, lines) => {
    if (err) {
      res.status(500).send(err);
    } else {
      for (let line of lines) {
        Item.findById(line.item.toString()).exec((err, item) => {
          if (err) {
            res.status(500).send(err);
          } else {
            if (item.global.length) {
              let index = item.global
                .map(i => line.currency.toString())
                .indexOf(currency);
              item.global[index].lastPrice[movementType] = line.price;
              item.save();
            }
          }
        });
      }
      lines.populate(
        [
          {
            path: 'item'
          }
        ],
        err => {
          res.send(lines);
        }
      );
    }
  });
}
export function create(req, res) {
  console.log('//////////////////////////// req.body from create');
  console.log(req.body);
  let line = new Line(req.body);
  let movementType = req.body.movementType === 'income' ? 'sell' : 'buy';
  let currency =
    typeof req.body.currency === 'object'
      ? req.body.currency._id
      : req.body.currency;
  line.creator = req.user._id;
  line.save((err, line) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // if (line.movement) {
      //   Movement.findByIdAndUpdate(
      //     line.movement,
      //     { $addToSet: { lines: line._id } },
      //     {},
      //     (err, movement) => {
      //       if (err) console.log(err);
      //     }
      //   );
      // }
      Item.findOne({ _id: req.body.item }).exec((err, item) => {
        if (err) {
          res.status(500).send(err);
        } else {
          if (item.global.length) {
            let index = item.global
              .map(i => i.currency.toString())
              .indexOf(currency);
            item.global[index].lastPrice[movementType] = line.price;
          }

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
  console.log('//////////////////////////// req.body from update');
  console.log(req.body);
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
            [movementType]: line.numbers.price
          }
        };
        console.log('//////////////////////////// from update');
        console.log(global);
        console.log('//////////////////////////// from update');
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
