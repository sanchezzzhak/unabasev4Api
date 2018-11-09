import bool from 'normalize-bool';
import Movement from '../models/movement';

import ntype from 'normalize-type';
import Line from '../models/line';

const routes = {
  get: (req, res) => {
    req.nm = 'test';
    let rquery = ntype(req.query);
    let options = {};
    options.page = rquery.page || 1;
    options.limit = rquery.limit || 20;

    options.select = 'name client.name createdAt total state';
    options.populate = [{ path: 'client', select: 'name' }];
    delete rquery.page;
    delete rquery.limit;
    let query = { ...rquery };
    console.log('query');
    console.log(query);
    Movement.paginate(query, options, (err, movements) => {
      if (err) {
        res.status(500).end();
      } else {
        res.json(movements);
      }
    });
  },
  create: (req, res) => {
    const {
      name,
      dates,
      client,
      state,
      lines,
      description,
      responsable
    } = req.body;
    let errorOnItem = { state: false };
    let newMovement = new Movement();
    newMovement.name = name || null;
    newMovement.description = description || null;
    newMovement.client = client || null;
    newMovement.creator = req.user._id || null;
    newMovement.responsable = responsable || null;
    newMovement.state = state || null;
    newMovement.lines = new Array();
    newMovement.dates = {
      expiration: req.body.dates.expiration
    };
    newMovement.total = {};
    newMovement.total.net = req.body.total.net;
    newMovement.total.tax = req.body.total.tax;

    Line.insertMany(lines)
      .then(items => {
        items.forEach(i => {
          newMovement.lines.push(i._id);
          console.log(i._id);
        });

        newMovement.save((err, movement) => {
          if (err) {
            console.log(err);
            res.status(500).send(err);
          } else {
            res.send(movement);
          }
        });
      })
      .catch(err => {
        errorOnItem.state = true;
        errorOnItem.msg = err;
      });
    // lines.forEach(async i => {
    //   let newLine = new Line();
    //   newLine.name = i.name;
    //   newLine.tax = i.tax;
    //   // newLine.number = i.number;
    //   newLine.quantity = i.quantity;
    //   newLine.price = i.price;
    //   newLine.item = i.item;
    //   // newLine.save((err, line) => {
    //   //   if (err) {
    //   //     errorOnItem.state = true;
    //   //     errorOnItem.msg = err;
    //   //   } else {
    //   //     console.log(line._id);
    //   //     newMovement.lines.push(line._id);
    //   //   }
    //   // });
    //   // let nLine;
    //   // try {
    //   //   nLine = await newLine.save();
    //   //   newMovement.lines.push(nLine._id);
    //   //   console.log(nLine._id);
    //   // } catch (err) {
    //   //   errorOnItem.state = true;
    //   //   errorOnItem.msg = err;
    //   // }
    // });
    // setTimeout(() => {
    //   console.log(newMovement);
    // }, 500);
  },
  getOne(req, res) {
    Movement.findOne({ _id: req.params.id })

      // .populate('lines creator', 'creator.name')
      // .populate('creator', 'name')
      // .populate('creator', 'google.email')
      // .populate('client', 'google.email')
      // .populate('client', 'name')
      .populate([
        { path: 'lines' },
        { path: 'creator', select: 'name google.email emails.default' },
        { path: 'client', select: 'name google.email emails.default' }
      ])
      .exec((err, movement) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(movement);
        }
      });
  },
  findOne: (req, res) => {
    let query = {
      $or: [{ name: req.query.name || null }]
    };
    Movement.findOne({ _id: req.params.id })
      .populate('items')
      .populate('creator', 'name')
      .exec((err, movement) => {
        if (err) {
          res.status(500).end();
        } else {
          res.send(movement);
        }
      });
  },
  find: (req, res) => {
    let query = {
      $and: [
        {
          $or: [
            {
              name: { $regex: req.params.q, $options: 'i' }
            },
            {
              description: { $regex: req.params.q, $options: 'i' }
            }
          ]
        },
        {
          $or: [
            {
              creator: { $regex: req.user._id, $options: 'i' }
            },
            {
              responsable: { $regex: req.user._id, $options: 'i' }
            }
          ]
        }
      ]
    };
    Movement.paginate(query, {}, (err, items) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(items);
      }
    });
  },
  updateOne: (req, res) => {
    let data = req.body;
    let update = {};
    for (let i in data) {
      if (
        data.hasOwnProperty(i) &&
        typeof data[i] !== 'undefined' &&
        data[i] !== null &&
        i !== 'lines'
      ) {
        update[i] = data[i];
      }
    }
    // update = {
    //   name: req.body.name,
    //   isActive: req.body.isActive,
    //   description: req.body.description,
    //   dates: {
    //     expiration: req.body.dates.description
    //   },
    //   client: req.body.client,
    //   total: {
    //     net: req.body.net,
    //     tax: req.body.tax
    //   },
    //   state: req.body.state,
    //   currency: req.body.currency,
    //   lines: []
    // };
    if (typeof req.body.lines !== 'undefined' && req.body.lines.length > 0) {
      update.lines = [];
      Line.updateManyMod(req.body.lines)
        .then(items => {
          console.log('items');
          console.log(items);
          items.lines.forEach(i => update.lines.push(i._id));

          Movement.findOneAndUpdate(
            { _id: req.params.id },
            update,
            { new: true },
            (err, movement) => {
              if (err) {
                console.log(err);
                res.status(500).send(err);
              } else {
                res.send(movement);
              }
            }
          );
        })
        .catch(err => {
          console.log('err');
          console.log(err);
        });
    } else {
      Movement.findOneAndUpdate(
        { _id: req.params.id },
        update,
        { new: true },
        (err, movement) => {
          if (err) {
            console.log(err);
            res.status(500).send(err);
          } else {
            res.send(movement);
          }
        }
      );
    }
  }
};

export default routes;
