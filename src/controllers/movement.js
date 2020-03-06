import Movement from "../models/movement";
import Contact from "../models/contact";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;
import Line from "../models/line";
import { queryHelper } from "../lib/queryHelper";
import { createError } from "../lib/error";
import { sendPush } from "../lib/push";
import User from "../models/user";
import Notification from "../models/notification";

export const getPersonal = (req, res, next) => {
  const select = "name client responsable createdAt updatedAt total state isActive dates successPercentage";
  const populate = [
    {
      path: "client.user",
      select: "isActive name  email phone creator user imgUrl emails type"
    },
    {
      path: "client.business",
      select: "isActive name  email phone creator user imgUrl emails type"
    },
    {
      path: "client.contact",
      select: "isActive name emails phones"
    },
    {
      path: "responsable.user",
      select: "isActive name  email phone creator user imgUrl emails type"
    },
    {
      path: "responsable.business",
      select: "isActive name  email phone creator user imgUrl emails type"
    },
    {
      path: "client.contact",
      select: "isActive name emails phones"
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
  let helper = queryHelper(req.query, {
    populate,
    select
  });

  const from = `${req.params.state === "in" ? "responsable" : "client"}.user`;
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
export const getByClientLine = async (req, res, next) => {
  const lines = await Line.find({ clientLine: req.params.id })
    .select("movement")
    .lean();
  const linesIds = lines.map(line => line.movement);
  Movement.find({ _id: { $in: linesIds }, isActive: true })
    .populate("responsable.user", "name")
    .populate("responsable.contact", "name")
    .populate("responsable.business", "name")
    .populate("client.user", "name")
    .populate("client.contact", "name")
    .populate("client.business", "name")
    .select("name client.user client.business client.contact  responsable.user responsable.business responsable.contact  state total successPercentage createdAt updatedAt")
    .exec((err, movements) => {
      if (err) next(err);
      res.send(movements);
    });
};
export const getRelated = async (req, res, next) => {
  let query = {
    $or: [
      {
        creator: req.user._id,
        "client.user": ObjectId(`${req.params.id}`)
      },
      {
        creator: req.user._id,
        "responsable.user": ObjectId(`${req.params.id}`)
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
      path: "client.user",
      select: "name phone email imgUrl emails type"
    },
    {
      path: "responsable.user",
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
      path: "client.user",
      select: "name phone email imgUrl emails type"
    },
    {
      path: "responsable.user",
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
      path: "client.user",
      select: "name imgUrl emails type"
    },
    {
      path: "responsable.user",
      select: "name imgUrl emails type"
    },
    {
      path: "client.business",
      select: "name imgUrl emails type"
    },
    {
      path: "responsable.business",
      select: "name imgUrl emails type"
    },
    {
      path: "client.contact",
      select: "isActive name emails phones"
    },
    {
      path: "responsable.contact",
      select: "isActive name emails phones"
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
  // TODO check permission, if the user can't see all the movement, filter by responsable/client.user
  switch (req.params.state) {
    case "in":
      query.$or = [
        {
          "responsable.business": ObjectId(`${req.params.id}`)
        }
      ];
      break;
    case "out":
      query.$or = [
        {
          "client.business": ObjectId(`${req.params.id}`)
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

  // req.body.currency = typeof req.body.currency === "string" ? req.body.currency : req.body.currency._id.toString();
  let newMovement = new Movement(req.body);

  newMovement.creator = req.user._id.toString() || null;

  newMovement.save((err, movement) => {
    if (err) return next(err);
    movement.populate(
      [
        {
          path: "client.user",
          select: "name  phone email imgUrl emails type"
        },
        {
          path: "responsable.user",
          select: "name  phone email imgUrl emails type"
        },
        {
          path: "client.contact",
          select: "isActive name emails phones"
        },
        {
          path: "responsable.contact",
          select: "isActive name emails phones"
        },
        {
          path: "creator",
          select: "name  imgUrl emails type"
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
        path: "client.user",
        select: "isActive name  email phone creator user imgUrl emails phones type"
      },

      {
        path: "client.business",
        select: "isActive name  email phone creator imgUrl emails phones"
      },
      {
        path: "client.contact",
        select: "isActive name emails phones"
      },
      {
        path: "responsable.user",
        select: "isActive name  email phone creator user imgUrl emails phones type"
      },
      {
        path: "responsable.business",
        select: "isActive name  email phone creator imgUrl emails phones"
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

          .populate("providers.user", "name emails idNumber")
          .populate("providers.contact", "name emails")
          .populate("providers.business", "name emails idNumber")
          .exec((err, lines) => {
            if (err) return next(err);

            movement.lines = lines;
            res.send(movement);
          });
      } else {
        return next(createError(404, req.lg.movement.notFound));
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
        path: "client.user",
        select: "isActive name  email phone creator user imgUrl emails type"
      },
      {
        path: "responsable.user",
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
            "responsable.user": ObjectId(`${req.user._id}`)
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
          path: "client.user",
          select: "isActive name  email phone creator user imgUrl emails type"
        },
        {
          path: "responsable.user",
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
    .populate([
      {
        path: "client.user",
        select: "isActive name  email phone creator user imgUrl emails type"
      },
      {
        path: "client.contact",
        select: "isActive name emails phones"
      },
      {
        path: "responsable.contact",
        select: "isActive name emails phones"
      },
      {
        path: "responsable.user",
        select: "isActive name  email phone creator user imgUrl emails type"
      },
      {
        path: "client.business",
        select: "isActive name  email phone creator user imgUrl emails type"
      },
      {
        path: "responsable.business",
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
export const updateState = async (req, res, next) => {
  let movement = await Movement.findByIdAndUpdate({ _id: req.params.id }, { state: req.body.state }).exec();
  let sourceLines;
  let lineUpdated;
  switch (req.params.action) {
    case "approve":
      // PUSH NOTIFICATION
      if (movement.responsable.user) {
        let user = await User.findById(movement.responsable.user)
          .select("name webpush")
          .lean();
        let link = `/income/${movement._id.toString()}`;
        let title = `Te han aprovado ${movement.name}`;
        let notification = new Notification({
          title,
          user: user._id.toString(),
          movement: movement._id.toString(),
          link,
          from: {
            user: req.user._id.toString()
          }
        });
        await notification.save();
        sendPush(
          {
            title,
            link
          },
          user
        );
      }

      let line = await Line.updateClientLine(req.body.clientLine);

      res.send({ movement, line });
      break;
  }
};

export const nullMany = (req, res, next) => {
  Movement.updateMany({ _id: { $in: req.body.movements } }, { isActive: false }).exec((err, data) => {
    if (err) next(err);
    res.send(data);
  });
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
  let lines = await Line.find({
    item: req.params.id
  }).exec();
  Movement.find({
    _id: {
      $in: lines.map(i => i.movement)
    }
  })
    .sort({
      updatedAt: -1
    })
    .limit(req.query.limit || 30)
    .populate([
      {
        path: "client.user",
        select: "name"
      }
    ])
    .exec((err, movements) => {
      if (err) return next(err);
      res.send(movements);
    });
};

export const createExpense = async (req, res, next) => {
  let sourceMovement = await Movement.findById(req.body.movement)
    .select("id name currency")
    .exec();
  let sourceLines = await Line.find({ _id: { $in: req.body.lines } })
    .select("id name item")
    .exec();
  try {
    let newMovement = new Movement({
      name: `Compra de ${sourceMovement.name}`,
      client: {
        user: req.user.id || req.user._id.toString(),
        business: req.user.scope.type === "business" ? req.user.scope.id._id.toString() : null
      },
      creator: req.user.id,
      state: "business",
      currency: sourceMovement.currency
    });
    let lines = [];
    for await (let sourceLine of sourceLines) {
      let newLine = new Line({
        item: sourceLine.item,
        name: sourceLine.name,
        numbers: {
          price: sourceLine.numbers.budget
        },
        requestedMovement: sourceMovement.id,
        clientLine: sourceLine.id,
        movement: newMovement.id,
        creator: req.user.id
      });
      let line = await newLine.save();
      await Line.findByIdAndUpdate(sourceLine.id, { $addToSet: { expenses: line._id } }).exec();
      lines.push(line);
    }
    let movement = await newMovement.save();

    res.send({ success: sourceLines.length === lines.length, movement });
  } catch (err) {
    next(err);
  }
};

export const createRequest = async (req, res, next) => {
  let sourceMovement = await Movement.findById(req.body.movement)
    .select("id name currency")
    .exec();
  let sourceLines = await Line.find({ _id: { $in: req.body.lines } })
    .select("id name item")
    .exec();
  let countSuccess = true;
  let lines = [];
  for (let provider of req.body.providers) {
    try {
      let client = req.user.scope.type === "personal" ? req.user.name : req.user.scope.id.name;
      console.log("before create new movement : : : : : :  : : ---------->");
      console.log(req.user.scope);
      let newMovement = new Movement({
        name: `${sourceMovement.name} / ${client}`,
        client: {
          user: req.user.id || req.user._id.toString(),
          business: req.user.scope.type === "business" ? req.user.scope.id._id.toString() : null
        },
        responsable: {
          user: provider.user,
          business: provider.business,
          contact: provider.contact
        },
        creator: req.user.id,
        state: req.params.state,
        currency: sourceMovement.currency,
        request: {
          message: req.body.request.message
        }
      });
      for await (let sourceLine of sourceLines) {
        let newLine = new Line({
          item: sourceLine.item,
          name: sourceLine.name,
          numbers: {
            price: req.body.setBudget ? sourceLine.numbers.budget : 0
          },
          requestedMovement: sourceMovement.id,
          clientLine: sourceLine.id,
          movement: newMovement.id,
          creator: req.user.id
        });
        let line = await newLine.save();
        await Line.findByIdAndUpdate(sourceLine.id, { $addToSet: { expenses: line._id } }).exec();
        lines.push(line);
      }
      let movement = await newMovement.save();
      // PUSH NOTIFICATION
      if (provider.user) {
        let user = await User.findById(provider.user)
          .select("name webpush")
          .lean();
        let link = `/income/${movement._id.toString()}`;
        let notification = new Notification({
          title: "Te han invitado a licitar! ",
          user: user._id.toString(),
          movement: movement._id.toString(),
          link,
          from: {
            user: req.user._id.toString()
          }
        });
        await notification.save();
        sendPush(
          {
            title: "Te han invitado a licitar! ",
            link
          },
          user
        );
      }
      countSuccess = countSuccess && sourceLines.length === lines.length;
    } catch (err) {
      next(err);
    }
  }

  res.send({ success: countSuccess, expenses: lines.map(line => line.id) });
};
