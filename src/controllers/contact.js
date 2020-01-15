import Contact from "../models/contact";
import ntype from "normalize-type";
import User from "../models/user";
import Line from "../models/line";
import Movement from "../models/movement";
export const get = (req, res, next) => {
  let rquery = ntype(req.query);
  let options = {};
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;
  const sort = rquery.createdAt ? { createdAt: rquery.createdAt } : { createdAt: "desc" };
  options.sort = { ...sort };
  delete rquery.createdAt;
  delete rquery.page;
  delete rquery.limit;
  // let query = { ...rquery };
  Contact.paginate(rquery, options, (err, items) => {
    if (err) next(err);
    res.send(items);
  });
};
export const getOne = (req, res, next) => {
  Contact.findById(req.params.id)
    .populate({
      path: "user",
      select: "name google.name google.email imgUrl emails phones"
    })
    .exec((err, item) => {
      if (err) next(err);
      if (item) {
        res.send(item);
      } else {
        res.status(404).end();
      }
    });
};
export const create = async (req, res, next) => {
  let userId;
  if (req.body.emails.length) {
    userId = await User.findOne({
      "emails.email": {
        $in: req.body.emails[0].email
      }
    });
  }
  let contact = new Contact(req.body);
  contact.creator = req.user._id;
  contact.user = userId ? userId._id : null;
  contact.save((err, item) => {
    if (err) next(err);
    if (item.user && item.user !== "") {
      User.findByIdAndUpdate(item.user, { $addToSet: { contacts: item._id } }, { new: true }, (err, user) => {
        if (err) next(err);
        item.populate([{ path: "user", select: "name google imgUrl emails" }], err => {
          res.send(item);
        });
      });
    } else {
      res.send(item);
    }
  });
};
export const find = (req, res, next) => {
  let rquery = ntype(req.query);
  let options = {};
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;
  delete rquery.page;
  delete rquery.limit;
  let query = {
    $or: [
      {
        name: { $regex: req.params.q, $options: "i" }
      },
      {
        email: { $regex: req.params.q, $options: "i" }
      }
    ]
  };
  Contact.paginate(
    query,
    {
      populate: [
        {
          path: "user",
          select: "name google.name google.email imgUrl emails.default"
        }
      ]
    },
    (err, items) => {
      if (err) next(err);
      res.send(items);
    }
  );
};
export const findSelf = (req, res, next) => {
  let rquery = ntype(req.query);
  let options = {};
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 30;
  options.sort = { createdAt: "desc" };
  delete rquery.page;
  delete rquery.limit;
  let query = {
    $or: [
      {
        $or: [
          {
            name: { $regex: req.params.q || "", $options: "i" }
          },
          {
            email: { $regex: req.params.q || "", $options: "i" }
          }
        ],
        creator: req.user._id
      }
    ],
    ...rquery
  };
  if (req.params.q) {
    query["$or"].push({
      $or: [
        {
          name: { $regex: req.params.q, $options: "i" }
        },
        {
          email: { $regex: req.params.q, $options: "i" }
        }
      ],
      type: "Business"
    });
  }
  Contact.paginate(
    query,
    {
      populate: [
        {
          path: "user",
          select: "name  imgUrl emails"
        }
      ],
      ...options
    },
    (err, items) => {
      if (err) next(err);
      res.send(items);
    }
  );
};
export const updateOne = (req, res, next) => {
  Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate("user")
    .exec((err, item) => {
      if (err) next(err);
      res.send(item);
    });
};

export const byItem = async (req, res, next) => {
  let rquery = ntype(req.query);
  let lines = await Line.find({ item: req.params.id }).exec();
  Movement.find({ _id: { $in: lines.map(i => i.movement) }, creator: req.user._id })
    .sort({ updatedAt: -1 })
    .populate([{ path: "client.user" }, { path: "responsable.user" }])
    .limit(rquery.limit || 30)
    .exec((err, movements) => {
      if (err) next(err);
      let contactsArray = new Array();
      let contactsIds = new Array();
      movements.forEach(movement => {
        if (!movement.client.user._id.equals(req.user._id) && !contactsIds.includes(movement.client.user._id)) {
          contactsArray.push(movement.client.user);
          contactsIds.push(movement.client.user._id);
        }
        if (!movement.responsable.user._id.equals(req.user._id) && !contactsIds.includes(movement.responsable.user._id)) {
          contactsArray.push(movement.responsable.user);
          contactsIds.push(movement.responsable.user._id);
        }
      });
      res.send(contactsArray);
    });
};
