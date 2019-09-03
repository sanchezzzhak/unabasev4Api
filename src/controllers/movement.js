import bool from "normalize-bool";
import Movement from "../models/movement";
import Contact from "../models/contact";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;
import ntype from "normalize-type";
import Line from "../models/line";
import { isEmpty } from "../lib/isEmpty";
import { errorHandler } from "../lib/errorHandler";

const routes = {};
export const getPersonal = (req, res) => {
  // const state = req.params.state;
  let rquery = ntype(req.query);
  let options = {};
  const sort = {};
  sort.createdAt = rquery.createdAtSort || "desc";
  sort.updatedAt = rquery.updatedAtSort || "desc";
  // sort.dates = {};
  // sort.dates.schedule = rquery.scheduleSort || "desc";
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;
  options.select = "name client responsable createdAt updatedAt total state isActive dates successPercentage";
  options.populate = [
    {
      path: "client.data",
      select: "isActive name  email phone creator user imgUrl emails type"
    },
    {
      path: "responsable.data",
      select: "isActive name  email phone creator user imgUrl emails type"
    },
    {
      path: "creator",
      select: "name google imgUrl emails.default"
    },
    {
      path: "lines"
    },
    {
      path: "currency"
    }
  ];
  options.sort = {
    ...sort
  };
  delete rquery.createdAtSort;
  delete rquery.updatedAtSort;
  delete rquery.scheduleSort;
  delete rquery.page;
  delete rquery.limit;
  let query = {
    ...rquery
  };
  switch (req.params.state) {
    case "in":
      // query.responsable = {        data: ObjectId(`${req.user._id}`)      };
      query.$or = [
        {
          "responsable.data": ObjectId(`${req.user._id}`)
        }
      ];
      break;
    case "out":
      // query.client = { data: ObjectId(`${req.user._id}`) };

      query.$or = [
        {
          "client.data": ObjectId(`${req.user._id}`)
        }
      ];
      break;
  }

  console.log("query");
  console.log(query);
  console.log(query.$or);
  console.log("options");
  console.log(options);
  Movement.paginate(query, options, async (err, movements) => {
    if (err) {
      res.status(500).end();
    } else {
      console.log("----------------after paginate");
      console.log(movements.docs.length);
      // let newMovements = {};
      // Object.assign(newMovements, movements);
      // newMovements.docs = [];
      // for (let i = 0; i < movements.docs.length; i++) {
      //   let lines = await Line.find(
      //     { movement: movements.docs[i]._id },
      //     'quantity price'
      //   );
      // }
      res.json(movements);
    }
  });
};
export const get = (req, res) => {
  let rquery = ntype(req.query);
  let options = {};
  const sort = rquery.createdAt
    ? {
        createdAt: rquery.createdAt
      }
    : {
        createdAt: "desc"
      };
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;
  options.select = "name client responsable createdAt total state";
  options.populate = [
    {
      path: "client.data",
      select: "name phone email imgUrl emails type"
    },
    {
      path: "responsable.data",
      select: "name phone email imgUrl emails type"
    },
    {
      path: "creator",
      select: "name imgUrl  emails"
    }
  ];
  options.sort = {
    ...sort
  };
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
};
export const getBusiness = (req, res) => {
  // const state = req.params.state;
  let rquery = ntype(req.query);
  let options = {};
  const sort = rquery.createdAt
    ? {
        createdAt: rquery.createdAt
      }
    : {
        createdAt: "desc"
      };
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;
  options.select = "name client responsable createdAt total state ";
  options.populate = [
    {
      path: "client.data",
      select: "name imgUrl emails type"
    },
    {
      path: "responsable.data",
      select: "name imgUrl emails type"
    },
    {
      path: "creator",
      select: "name  imgUrl emails"
    },
    {
      path: "lines"
    },
    {
      path: "currency"
    }
  ];
  options.sort = {
    ...sort
  };
  delete rquery.createdAt;
  delete rquery.page;
  delete rquery.limit;
  let query = {
    ...rquery
  };

  switch (req.params.state) {
    case "in":
      query.$or = [
        {
          "responsable.data": ObjectId(`${req.params.id}`)
        }
      ];
      break;
    case "out":
      query.$or = [
        {
          "client.data": ObjectId(`${req.params.id}`)
        }
      ];
      break;
  }
  Movement.paginate(query, options, (err, movements) => {
    if (err) {
      res.status(500).end();
    } else {
      res.json(movements);
    }
  });
};
export const create = (req, res) => {
  const { name, dates, client, contact, state, lines, description, responsable, personal, total } = req.body;
  let errorOnItem = {
    state: false
  };
  delete req.body.lines;

  let newMovement = new Movement(req.body);

  newMovement.creator = req.user._id || null;

  newMovement.save((err, movement) => {
    if (err) {
      console.log(err);
      // res.status(500).send(err);
      errorHandler({
        err,
        res,
        from: "movement create",
        status: 500
      });
    } else {
      movement.populate(
        [
          {
            path: "client.data",
            select: "name  phone email imgUrl emails type"
          },
          {
            path: "responsable.data",
            select: "name  phone email imgUrl emails type"
          },
          {
            path: "creator",
            select: "name  imgUrl emails type"
          },
          {
            path: "contact"
          },
          {
            path: "currency"
          }
        ],
        err => {
          res.send(movement);
        }
      );
    }
  });
  // }
};
export const getOne = (req, res) => {
  Movement.findOne({
    _id: req.params.id
  })

    // .populate('lines creator', 'creator.name')
    // .populate('creator', 'name')
    // .populate('creator', 'google.email')
    // .populate('client', 'google.email')
    // .populate('client', 'name')
    .populate([
      // { path: 'lines' },
      {
        path: "contact"
      },
      {
        path: "comments",
        options: {
          sort: {
            createdAt: "desc"
          }
        }
      },
      {
        path: "comments.creator"
      },

      {
        path: "client.data",
        select: "isActive name  email phone creator user imgUrl emails type"
      },
      {
        path: "responsable.data",
        select: "isActive name  email phone creator user imgUrl emails type"
      },
      {
        path: "creator",
        select: "name  imgUrl emails"
      },
      {
        path: "currency"
      }
    ])
    .exec((err, movement) => {
      if (err) {
        res.status(500).send(err);
      } else if (movement) {
        Line.find({
          movement: movement._id
        })
          .populate({
            path: "item",
            populate: ["global", "lastPrice"]
          })
          // .populate([
          //   {
          //     path: 'children',
          //     populate: [
          //       {
          //         path: 'children',
          //         populate: [
          //           {
          //             path: 'children',
          //             populate: [
          //               { path: 'children', populate: 'children' },
          //               {
          //                 path: 'item',
          //                 select: 'lastPrice global'
          //               }
          //             ]
          //           },
          //           {
          //             path: 'item',
          //             select: 'lastPrice global'
          //           }
          //         ]
          //       },
          //       {
          //         path: 'item',
          //         select: 'lastPrice global'
          //       }
          //     ]
          //   },
          //   {
          //     path: 'item',
          //     select: 'lastPrice global'
          //   }
          // ])
          .exec((err, lines) => {
            if (err) {
              res.status(500).send(err);
            } else {
              movement.lines = lines;
              res.send(movement);
            }
          });
      } else {
        res.status(404).send("Not found");
      }
    });
};
export const findOne = (req, res) => {
  let query = {
    $or: [
      {
        name: req.query.name || null
      }
    ]
  };
  Movement.findOne({
    _id: req.params.id
  })
    .populate([
      {
        path: "lines"
      },
      {
        path: "comments"
      },
      {
        path: "comments.creator"
      },
      {
        path: "creator",
        select: "name  imgUrl emails"
      },
      {
        path: "client.data",
        select: "isActive name  email phone creator user imgUrl emails type"
      },
      {
        path: "responsable.data",
        select: "isActive name  email phone creator user imgUrl emails type"
      }
    ])
    .exec((err, movement) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(movement);
      }
    });
};
export const find = (req, res) => {
  let rquery = ntype(req.query);
  let query = {
    $and: [
      {
        $or: [
          {
            name: {
              $regex: req.params.q,
              $options: "i"
            }
          },
          {
            description: {
              $regex: req.params.q,
              $options: "i"
            }
          }
        ]
      },
      {
        $or: [
          {
            creator: req.user._id
          },
          {
            "responsable.data": ObjectId(`${req.user._id}`)
          }
        ]
      }
    ]
  };
  Object.assign(query, rquery);

  Movement.paginate(
    query,
    {
      path: "client",
      match: {
        name: req.params.q
      },

      populate: [
        {
          path: "client.data",
          select: "isActive name  email phone creator user imgUrl emails type"
        },
        {
          path: "responsable.data",
          select: "isActive name  email phone creator user imgUrl emails type"
        }
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
};
export const updateOne = (req, res) => {
  let data = req.body;
  let update = {};
  for (let i in data) {
    if (data.hasOwnProperty(i) && typeof data[i] !== "undefined" && data[i] !== null && i !== "lines") {
      update[i] = data[i];
    }
  }
  // if (typeof req.body.lines !== 'undefined' && req.body.lines.length > 0) {
  //   update.lines = [];
  //   Line.updateManyMod(req.body.lines)
  //     .then(items => {
  //       console.log('items');
  //       console.log(items);
  //       items.lines.forEach(i => update.lines.push(i._id));

  //       Movement.findOneAndUpdate(
  //         { _id: req.params.id },
  //         update,
  //         { new: true },
  //         (err, movement) => {
  //           if (err) {
  //             console.log(err);
  //             res.status(500).send(err);
  //           } else {
  //             res.send(movement);
  //           }
  //         }
  //       );
  //     })
  //     .catch(err => {
  //       console.log('err');
  //       console.log(err);
  //     });
  // } else {
  Movement.findOneAndUpdate(
    {
      _id: req.params.id
    },
    update,
    {
      new: true
    }
  )
    .populate("client.data")
    .exec((err, movement) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.send(movement);
      }
    });
  // }
};
export const linkMovement = (email, user) => {
  Contact.find(
    {
      email
    },
    (err, contacts) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        for (let contact of contacts) {
          let client = {
            "client.type": "Contact",
            "client.data": contact._id
          };
          let clientUpdate = {
            "client.type": "User",
            "client.data": user._id
          };
          let responsable = {
            "responsable.type": "Contact",
            "responsable.data": contact._id
          };
          let responsableUpdate = {
            "responsable.type": "User",
            "responsable.data": user._id
          };
          Movement.updateMany(client, clientUpdate, {}).exec();
          Movement.updateMany(responsable, responsableUpdate, {}).exec();
        }
      }
    }
  );
};
