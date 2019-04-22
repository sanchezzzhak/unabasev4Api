import Line from '../models/line';
import Movement from '../models/movement';
import Item from '../models/item';
import Currency from '../models/currency';

import { Types } from 'mongoose';
const ObjectId = Types.ObjectId;

export function get(req, res) {
  let rquery = ntype(req.query);
  let options = {};
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;

  options.populate = [
    { path: 'tax', select: 'name number' },
    { path: 'item' },
    {
      path: 'children',
      populate: {
        path: 'children',
        populate: { path: 'children', populate: { path: 'children', populate: 'children' } }
      }
    }
  ];
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
  Line.insertMany(req.body, async (err, lines) => {
    if (err) {
      res.status(500).send(err);
    } else {
      await Line.populate(lines, { path: 'item' });
      res.send(lines);
    }
  });
}
export function create(req, res) {
  console.log('//////////////////////////// req.body from create');
  console.log(req.body);
  let line = new Line(req.body);
  let movementType = req.body.movementType === 'income' ? 'sell' : 'buy';
  let currency = typeof req.body.currency === 'object' ? req.body.currency._id : req.body.currency;
  line.creator = req.user._id;
  line.save((err, line) => {
    if (err) {
      res.status(500).send(err);
    } else {
      Item.findOne({ _id: req.body.item }).exec((err, item) => {
        if (err) {
          res.status(500).send(err);
        } else {
          if (item.global.length) {
            let index = item.global.map(i => i.currency.toString()).indexOf(currency);
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
  let currency = typeof req.body.currency === 'object' ? req.body.currency._id : req.body.currency;
  Line.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, line) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else if (line) {
      // let global = {
      //   currency,
      //   lastPrice: {
      //     [movementType]: line.numbers.price
      //   }
      // };
      // console.log('//////////////////////////// global from update');
      // console.log(global);
      console.log('/---------------req.body.movementType');
      console.log(req.body.movementType);
      console.log('/---------------movementType');
      console.log(movementType);
      console.log('/---------------currency');
      console.log(currency);
      console.log('/---------------currencytoString');
      console.log(currency.toString());
      console.log('/---------------line.item.toString()');
      console.log(line.item.toString());
      // Item.findByIdAndUpdate(
      //   line.item,
      //   { $set: { global } },
      //   { new: true }
      // ).exec();
      Movement.findByIdAndUpdate(line.movement, {
        total: req.body.totalMovement
      }).exec();
      Line.findByIdAndUpdate(req.body.parent, {
        $addToSet: { children: line._id }
      }).exec();
      Item.findById(line.item.toString()).exec((err, item) => {
        if (err) {
          res.status(500).send(err);
        } else {
          console.log('/---------------item found');
          console.log(item);
          let index = item.global.map(i => i.currency.toString()).indexOf(currency);
          console.log('/---------------index');
          console.log(index);
          item.global[index].lastPrice[movementType] = line.numbers.price;
          item.save();
          console.log('/---------------item.global[index]');
          console.log(item.global[index]);
        }
      });
      res.send(line);
    }
  });
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
