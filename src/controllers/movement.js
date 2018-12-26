import bool from 'normalize-bool';
import Movement from '../models/movement';
import { Types } from 'mongoose';
const ObjectId = Types.ObjectId;
import ntype from 'normalize-type';
import Line from '../models/line';
import { isEmpty } from '../lib/isEmpty';

const routes = {
  get: (req, res) => {
    let rquery = ntype(req.query);
    let options = {};
    const sort = rquery.createdAt
      ? { createdAt: rquery.createdAt }
      : { createdAt: 'desc' };
    options.page = rquery.page || 1;
    options.limit = rquery.limit || 20;
    options.select = 'name client.name createdAt total state contactName';
    options.populate = [
      { path: 'client', select: 'name google emails.default' },
      { path: 'contact' },
      { path: 'responsable', select: 'name google emails.default' },
      { path: 'creator', select: 'name google emails.default' }
    ];
    options.sort = { ...sort };
    delete rquery.createdAt;
    delete rquery.page;
    delete rquery.limit;
    let query = {
      ...rquery
    };
    // if (rquery.responsable) {
    //   query.$or = [
    //     {
    //       responsable: rquery.creator
    //     }
    //   ];
    // }
    Movement.paginate(query, options, (err, movements) => {
      if (err) {
        res.status(500).end();
      } else {
        res.json(movements);
      }
    });
  },
  getPersonal: (req, res) => {
    // const state = req.params.state;
    let rquery = ntype(req.query);
    let options = {};
    const sort = rquery.createdAt
      ? { createdAt: rquery.createdAt }
      : { createdAt: 'desc' };
    options.page = rquery.page || 1;
    options.limit = rquery.limit || 20;
    options.select = 'name client.name createdAt total state contactName';
    options.populate = [
      { path: 'personal.client', select: 'name google emails.default' },
      { path: 'contact' },
      { path: 'personal.responsable', select: 'name google emails.default' },
      { path: 'creator', select: 'name google emails.default' }
    ];
    options.sort = { ...sort };
    delete rquery.createdAt;
    delete rquery.page;
    delete rquery.limit;
    let query = {
      isBusiness: false,
      ...rquery
    };
    switch (req.params.state) {
      case 'in':
        query.$or = [{ 'personal.responsable': ObjectId(`${req.user._id}`) }];
        break;
      case 'out':
        query.$or = [{ 'personal.client': ObjectId(`${req.user._id}`) }];
        break;
    }
    Movement.paginate(query, options, (err, movements) => {
      if (err) {
        res.status(500).end();
      } else {
        res.json(movements);
      }
    });
  },
  getBusiness: (req, res) => {
    // const state = req.params.state;
    let rquery = ntype(req.query);
    let options = {};
    const sort = rquery.createdAt
      ? { createdAt: rquery.createdAt }
      : { createdAt: 'desc' };
    options.page = rquery.page || 1;
    options.limit = rquery.limit || 20;
    options.select = 'name client.name createdAt total state contactName';
    options.populate = [
      { path: 'personal.client', select: 'name google emails.default' },
      { path: 'contact' },
      { path: 'personal.responsable', select: 'name google emails.default' },
      { path: 'business.responsable', select: 'name google emails.default' },
      { path: 'creator', select: 'name google emails.default' }
    ];
    options.sort = { ...sort };
    delete rquery.createdAt;
    delete rquery.page;
    delete rquery.limit;
    let query = {
      isBusiness: true,
      ...rquery
    };
    switch (req.params.state) {
      case 'in':
        query.$or = [
          { 'business.responsable': req.user._id },
          { creator: req.user._id }
        ];
        break;
      case 'out':
        query.$client = req.user._id;
        break;
    }
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
      contact,
      state,
      lines,
      description,
      responsable,
      personal,
      total
    } = req.body;
    let errorOnItem = { state: false };
    delete req.body.lines;
    let newMovement = new Movement(req.body);
    // newMovement.name = name || null;
    // newMovement.description = description || null;
    // newMovement.client = client || null;
    // newMovement.contact = contact || null;
    // newMovement.state = state || 'draft';
    // newMovement.dates = dates;

    // req.body.responsable ?
    // newMovement.personal.responsable =
    //   personal.responsable || req.user._id || null;
    if (isEmpty(newMovement.personal.responsable)) {
      newMovement.personal.responsable = req.user._id;
    }

    console.log('new');
    console.log(newMovement.personal.responsable);
    console.log(isEmpty(newMovement.personal.responsable));

    console.log('from req');
    console.log(personal.responsable);
    newMovement.creator = req.user._id || null;
    newMovement.lines = new Array();

    // const { net, tax } = total || 0;
    // newMovement.total = {
    //   net: net || 0,
    //   tax: tax || 0
    // };
    if (typeof lines !== 'undefined' && lines.length) {
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
              movement.populate(
                [
                  {
                    path: 'personal.client',
                    select: 'name google.name google.email google.imgUrl'
                  },
                  {
                    path: 'personal.responsable',
                    select: 'name google.name google.email google.imgUrl'
                  },
                  {
                    path: 'creator',
                    select: 'name google.name google.email google.imgUrl'
                  },
                  {
                    path: 'contact'
                  }
                ],
                err => {
                  res.send(movement);
                }
              );
            }
          });
        })
        .catch(err => {
          errorOnItem.state = true;
          errorOnItem.msg = err;
        });
    } else {
      newMovement.save((err, movement) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          movement.populate(
            [
              {
                path: 'personal.client',
                select:
                  'name google.name google.email google.imgUrl emails.default'
              },
              {
                path: 'personal.responsable',
                select:
                  'name google.name google.email google.imgUrl emails.default'
              },
              {
                path: 'creator',
                select:
                  'name google.name google.email google.imgUrl emails.default'
              },
              {
                path: 'contact'
              }
            ],
            err => {
              res.send(movement);
            }
          );
        }
      });
    }
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
        { path: 'contact' },
        { path: 'comments', options: { sort: { createdAt: 'desc' } } },
        { path: 'comments.creator' },

        {
          path: 'personal.client',
          select: 'name google.name google.email google.imgUrl emails.default'
        },
        {
          path: 'personal.responsable',
          select: 'name google.name google.email google.imgUrl emails.default'
        },
        {
          path: 'creator',
          select: 'name google.name google.email google.imgUrl emails.default'
        }
      ])
      .exec((err, movement) => {
        if (err) {
          res.status(500).send(err);
        } else if (movement) {
          res.send(movement);
        } else {
          res.status(404).send('Not found');
        }
      });
  },
  findOne: (req, res) => {
    let query = {
      $or: [{ name: req.query.name || null }]
    };
    Movement.findOne({ _id: req.params.id })
      .populate([
        { path: 'lines' },
        { path: 'comments' },
        { path: 'comments.creator' },
        { path: 'creator', select: 'name google emails.default' },
        { path: 'personal.client', select: 'name google emails.default' },
        { path: 'personal.responsable', select: 'name google emails.default' }
      ])
      .exec((err, movement) => {
        if (err) {
          res.status(500).end();
        } else {
          res.send(movement);
        }
      });
  },
  find: (req, res) => {
    let rquery = ntype(req.query);
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
              creator: req.user._id
            },
            {
              'personal.responsable': req.user._id
            }
          ]
        }
      ]
    };
    Object.assign(query, rquery);

    console.log('query movement');
    console.log(query.$and[0].$or);
    console.log(query.$and[1].$or);

    Movement.paginate(
      query,
      {
        path: 'client',
        match: { name: req.params.q },

        populate: [
          { path: 'personal.client', select: 'name' },
          { path: 'contact' }
        ]
      },
      (err, items) => {
        if (err) {
          console.warn(err);
          res.status(500).send(err);
        } else {
          res.send(items);
        }
      }
    );
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
