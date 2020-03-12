import User from "../models/user";
import Line from "../models/line";
import Item from "../models/item";
import { send } from "../config/mailer";
import template from "../lib/mails";
import ntype from "normalize-type";
// import findByValue from '../lib/findObjectByValue';
// import accountTypeByUrl from '../lib/accountTypeByUrl';
import Contact from "../models/contact";
import { getUserData, getUserPermission } from "../lib/user";
import UserPermission from "../models/userPermission";
import { notFoundError, createError } from "../lib/error";
import { getLocationByIp } from "../lib/location";
import Currency from "../models/currency";
import { getCurrencyByLocation } from "../lib/currency";

// TODO verify that the password is not returning to the client
export const create = async (req, res, next) => {
  let user = new User();
  if (req.body.password) {
    req.body.password = User.hash(req.body.password);
  }
  const type = req.body.type || "personal";
  try {
    // const location = await getLocationByIp(req);
    // const countryOrigin = location.data.country ? location.data.country.toLowerCase() : "chile";
    // const currency = await Currency.findOne({ countryOrigin }).exec();

    user.currency = await getCurrencyByLocation(req);
  } catch (err) {
    logy(err);
  }

  Object.assign(user, req.body);
  if (type === "business") {
    user.creator = req.user._id;
    user.users = [req.user._id];
    user.admins = [
      {
        description: "creator",
        user: req.user._id
      }
    ];
  }
  user.save((err, item) => {
    if (err) next(err);
    if (type === "business") {
      let contact = new Contact();
      contact.name = user.name;
      contact.type = "Business";
      contact.user = user._id;
      contact.save();
    }
    res.send(item);
  });
};
export const password = (req, res, next) => {
  const { password, newPassword } = req.body;

  User.findById(req.user._id, async (err, user) => {
    if (err) next(err);
    if (!user) next(notFoundError());
    if (typeof user.password == "undefined" || user.password === null) {
      user.password = user.generateHash(newPassword.toString());
      user.security.hasPassword = true;
      try {
        await user.save();
        res.status(200).send({
          msg: "password created"
        });
      } catch (err) {
        next(err);
      }
    } else if (password && user.validPassword(password.toString())) {
      user.password = user.generateHash(newPassword.toString());
      user.save();
      res.status(200).send({
        msg: "password changed"
      });
    } else {
      next({ message: "passwords do not match" });
    }
  });
};
export const restart = (req, res, next) => {
  let query = {
    $or: [
      {
        username: {
          $regex: req.params.q,
          $options: "i"
        }
      },
      {
        "emails.email": {
          $regex: req.params.q,
          $options: "i"
        }
      }
    ],
    type: "personal"
  };

  User.findOne(query, (err, item) => {
    if (err) next(err);
    if (!item) next(notFoundError());
    const email = item.emails.filter(i => i.label === "default" || i.label === "google");

    const { text, subject } = template().restartPassword({
      origin: req.headers.origin,
      lang: req.locale.language,
      id: item._id
    });
    const msg = {
      to: email[0].email,
      subject: subject,
      html: text
    };
    send(msg)
      .then(resp => {
        res.status(200).send({
          msg: "password restart success"
        });
      })
      .catch(err => {
        next(err);
      });
  });
};
export const logout = (req, res, next) => {
  req.logout();
  req.session = null;
  res.status(200).send("Log out");
};
export const get = (req, res, next) => {
  logy("list users");
  let rquery = ntype(req.query);
  let options = {};
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;
  delete rquery.page;
  delete rquery.limit;
  const type = req.query.type || "personal";
  let query = {
    ...rquery,
    type
  };
  if (type === "business") {
    query.users = {
      $in: [req.user._id]
    };
  }

  User.paginate(query, options, (err, item) => {
    if (err) next(err);
    res.send(item);
  });
};
export const getOne = (req, res, next) => {
  logy(req.params.id);

  const type = req.query.type || "personal";
  User.findOne({
    _id: req.params.id,
    type
  })
    .select(
      "isActive security.hasPassword security.isRandom isActive name username idNumber phones emails scope address imgUrl currency google.name google.email google.imgUrl contacts"
    )
    .populate("users")
    .populate("business")
    .exec((err, user) => {
      if (err) next(err);
      if (!user) next(notFoundError());
      // res.send(getUserData(user));
      res.send(user);
    });
};
export const update = (req, res, next) => {
  if (req.body.scope.type === "business" && (req.body.scope.id == null || req.body.scope.id == req.user._id)) next(createError(500, req.lg.user.businessNotNull));
  User.findOneAndUpdate(
    {
      _id: req.params.id
    },
    req.body,
    {
      new: true
    }
  )
    .select(
      "isActive webpush security.hasPassword security.isRandom isActive name username idNumber phones emails scope address imgUrl currency google.name google.email google.imgUrl contacts otherAccounts"
    )
    .populate("currency")
    .populate("scope.id")
    .exec(async (err, item) => {
      if (err) return next(err);
      try {
        let userPermissions = await UserPermission.find({
          user: item._id.toString(),
          business: item.scope.id?._id.toString() || null
        })
          .select("permission")
          .populate("permission")
          .exec();
        // let user = getUserData(item);
        let permissions = userPermissions.map(userPermission => userPermission.permission);
        item.permissions = permissions;
        res.send(item);
      } catch (err) {
        return next(err);
      }
    });
};
export const business = (req, res, next) => {
  let update = {
    $addToSet: {
      business: req.body.business
    }
  };
  User.findByIdAndUpdate(
    req.params.id,
    update,
    {
      new: true
    },
    (err, item) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(item);
      }
    }
  );
};
export const user = (req, res, next) => {
  let update = {
    $addToSet: {
      users: req.body.user
    }
  };
  User.findByIdAndUpdate(
    req.params.id,
    update,
    {
      new: true
    },
    (err, item) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(item);
      }
    }
  );
};
export const scope = (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      scope: {
        type: req.body.type,
        id: req.body.id
      }
    },
    {
      new: true
    },
    (err, item) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(item);
      }
    }
  );
};
export const find = (req, res, next) => {
  const type = req.query.type || "personal";
  let query = {
    $and: [
      {
        $or: [
          {
            "emails.email": {
              $regex: req.params.q,
              $options: "i"
            }
          },
          {
            name: {
              $regex: req.params.q,
              $options: "i"
            }
          },
          {
            username: {
              $regex: req.params.q,
              $options: "i"
            }
          },
          {
            idNumber: {
              $regex: req.params.q,
              $options: "i"
            }
          }
        ]
      },
      {
        type
      }
    ]
  };
  User.paginate(
    query,
    {
      populate: [
        {
          path: "business"
        }
      ],
      select:
        "isActive security.hasPassword security.isRandom isActive name username idNumber phones emails scope address imgUrl currency google.name google.email google.imgUrl contacts otherAccounts"
    },
    async (err, items) => {
      if (err) next(err);
      let users = [];
      // items.docs.forEach(item => {
      //   // users.push(getUserData(item));
      //   users.push(user);
      // });
      // items.docs = users;
      res.send(items);
    }
  );
};
export const relationsFind = (req, res, next) => {
  let query = {
    $and: [
      {
        $or: [
          {
            "emails.email": {
              $regex: req.params.q,
              $options: "i"
            }
          },
          {
            name: {
              $regex: req.params.q,
              $options: "i"
            }
          },
          {
            username: {
              $regex: req.params.q,
              $options: "i"
            }
          },
          {
            idNumber: {
              $regex: req.params.q,
              $options: "i"
            }
          }
        ]
      },
      {
        "relations.id": req.user._id
      }
    ]
  };
  logy(query);
  User.paginate(query, {}, (err, items) => {
    if (err) {
      res.status(500).end();
    } else {
      res.send(items);
    }
  });
};
export const lastItems = (req, res, next) => {
  Line.find({
    creator: req.user._id,
    isParent: false
  })
    .sort({
      updatedAt: -1
    })
    .limit(100)
    .populate([
      {
        path: "item"
      },
      {
        path: "children"
      }
    ])
    .exec((err, lines) => {
      if (err) next(err);
      if (!lines) next(notFoundError());
      let docs = [];
      for (let line of lines) {
        if (line.item) {
          if (docs.filter(i => i._id === line.item._id).length === 0) {
            docs.push(line.item);
          }
        }
      }
      res.send(docs);
    });
};
export const lastParents = (req, res, next) => {
  Line.find({
    creator: req.user._id,
    isParent: true
  })
    .sort({
      updatedAt: -1
    })
    .limit(100)
    // .populate([{ path: "item" }, { path: "children" }])
    .exec((err, lines) => {
      if (err) next(err);
      if (!lines) next(notFoundError());
      let itemsIds = lines.map(line => line.item);

      Item.find({
        _id: {
          $in: itemsIds
        },
        isParent: true
      })
        .sort({
          updatedAt: -1
        })
        .limit(100)
        .populate([
          {
            path: "children"
          }
        ])
        .exec((err, items) => {
          if (err) next(err);
          if (!items) next(notFoundError());
          res.send(items);
        });
    });
};
