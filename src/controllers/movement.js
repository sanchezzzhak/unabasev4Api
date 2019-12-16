import Movement from "../models/movement";
import Contact from "../models/contact";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;
import Line from "../models/line";
import { queryHelper } from "../lib/queryHelper";
import { createError } from "../lib/error";

const routes = {};
export const getPersonal = (req, res, next) => {
  const select = "name client responsable createdAt updatedAt total state isActive dates successPercentage";
  const populate = [
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
  let helper = queryHelper(req.query, { populate, select });

  const from = `${req.params.state === "in" ? "responsable" : "client"}.data`;
  helper.query.$or = [
    {
      [from]: ObjectId(`${req.user._id}`)
    }
  ];

  Movement.paginate(helper.query, helper.options, async (err, movements) => {
    if (err) return next(err);
    res.json(movements);
  });
};
export const getRelated = async (req, res, next) => {
  let query = {
    $or: [
      {
        creator: req.user._id,
        "client.data": ObjectId(`${req.params.id}`)
      },
      {
        creator: req.user._id,
        "responsable.data": ObjectId(`${req.params.id}`)
      }
    ]
  };

  let options = {};
  const sort = req.query.createdAt
    ? {
        createdAt: req.query.createdAt
      }
    : {
        createdAt: "desc"
      };
  options.page = req.query.page || 1;
  options.limit = req.query.limit || 20;
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
  delete req.query.createdAt;
  delete req.query.page;
  delete req.query.limit;
  Movement.paginate(query, options, (err, movements) => {
    if (err) return next(err);
    res.json(movements);
  });
};
export const get = (req, res, next) => {
  let options = {};
  const sort = req.query.createdAt
    ? {
        createdAt: req.query.createdAt
      }
    : {
        createdAt: "desc"
      };
  options.page = req.query.page || 1;
  options.limit = req.query.limit || 20;
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
  delete req.query.createdAt;
  delete req.query.page;
  delete req.query.limit;
  let query = {
    ...req.query
  };
  Movement.paginate(query, options, (err, movements) => {
    if (err) return next(err);
    res.json(movements);
  });
};
export const getBusiness = (req, res, next) => {
  let options = {};
  const sort = req.query.createdAt
    ? {
        createdAt: req.query.createdAt
      }
    : {
        createdAt: "desc"
      };
  options.page = req.query.page || 1;
  options.limit = req.query.limit || 20;
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
  delete req.query.createdAt;
  delete req.query.page;
  delete req.query.limit;
  let query = {
    ...req.query
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
    if (err) return next(err);
    res.json(movements);
  });
};
export const create = (req, res, next) => {
  const { name, dates, client, contact, state, lines, description, responsable, personal, total } = req.body;
  let errorOnItem = {
    state: false
  };
  delete req.body.lines;

  let newMovement = new Movement(req.body);

  newMovement.creator = req.user._id || null;

  newMovement.save((err, movement) => {
    if (err) return next(err);
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
  });
};
export const getOne = (req, res, next) => {
  Movement.findOne({
    _id: req.params.id
  })

    .populate([
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
        select: "isActive name  email phone creator user imgUrl emails phones type"
      },
      {
        path: "responsable.data",
        select: "isActive name  email phone creator user imgUrl emails phones type"
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
      if (err) return next(err);
      if (movement) {
        Line.find({
          movement: movement._id
        })
          .populate("item", "lastPrice global ")
          .populate([
            {
              path: "item",
              populate: [
                {
                  path: "global.taxes"
                }
              ]
            }
          ])
          .exec((err, lines) => {
            if (err) return next(err);
            movement.lines = lines;
            res.send(movement);
          });
      } else {
        return next(createError(404, "movement not found"));
      }
    });
};
export const findOne = (req, res, next) => {
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
      if (err) return next(err);
      res.send(movement);
    });
};
export const find = (req, res, next) => {
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
  Object.assign(query, req.query);

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
      if (err) return next(err);
      res.send(items);
    }
  );
};
export const updateOne = (req, res, next) => {
  let data = req.body;
  let update = {};
  for (let i in data) {
    if (data.hasOwnProperty(i) && typeof data[i] !== "undefined" && data[i] !== null && i !== "lines") {
      update[i] = data[i];
    }
  }

  Movement.findOneAndUpdate(
    {
      _id: req.params.id
    },
    update,
    {
      new: true
    }
  )
    // .populate("client.data")
    .populate([
      {
        path: "client.data",
        select: "isActive name  email phone creator user imgUrl emails type"
      },
      {
        path: "responsable.data",
        select: "isActive name  email phone creator user imgUrl emails type"
      },
      {
        path: "currency"
      }
    ])
    .exec((err, movement) => {
      if (err) return next(err);
      res.send(movement);
    });
  // }
};
export const linkMovement = (req, res, next) => {
  Contact.find(
    {
      email
    },
    (err, contacts) => {
      if (err) return next(err);
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
  );
};

export const byItem = async (req, res, next) => {
  let lines = await Line.find({ item: req.params.id }).exec();
  Movement.find({ _id: { $in: lines.map(i => i.movement) } })
    .sort({ updatedAt: -1 })
    .limit(req.query.limit || 30)
    .populate([
      {
        path: "client.data",
        select: "name"
      }
    ])
    .exec((err, movements) => {
      if (err) return next(err);
      res.send(movements);
    });
};
