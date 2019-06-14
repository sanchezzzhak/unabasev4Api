import User from "../models/user";
import Line from "../models/line";
import Item from "../models/item";
import { send } from "../config/mailer";
import template from "../lib/mails";
import ntype from "normalize-type";
// import findByValue from '../lib/findObjectByValue';
// import accountTypeByUrl from '../lib/accountTypeByUrl';
import Contact from "../models/contact";
export const create = (req, res) => {
  let user = new User();
  if (req.body.password) {
    req.body.password.hash = User.hash(req.body.password.hash);
  }
  const type = req.body.type || "personal";

  Object.assign(user, req.body);
  if (type === "business") {
    user.creator = req.user._id;
    user.users = [req.user._id];
    user.admins = [{ description: "creator", user: req.user._id }];
  }
  user.save((err, item) => {
    if (err) {
      res.status(500).end();
    } else {
      if (type === "business") {
        let contact = new Contact();
        contact.name = user.name;
        contact.type = "Business";
        contact.user = user._id;
        contact.save();
      }
      res.send(item);
    }
  });
};
export const password = (req, res) => {
  const { password, newPassword } = req.body;
  console.log(req.body);
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (typeof user.password === "undefined") {
        res.status(200).send({ msg: "password created" });

        user.password.hash = user.generateHash(newPassword);
        user.save();
      } else if (user.validPassword(password)) {
        user.password.hash = user.generateHash(newPassword);
        user.save();
        res.status(200).send({ msg: "password changed" });
      } else {
        res.status(500).send({ msg: "password change failed" });
      }
    }
  });
};
export const restart = (req, res) => {
  console.log("enter restart password");

  let query = {
    $or: [
      { username: { $regex: req.params.q, $options: "i" } },
      { "emails.email": { $regex: req.params.q, $options: "i" } }
    ],
    type: "personal"
  };

  // console.log(query.$or);
  User.findOne(query, (err, item) => {
    if (err) {
      res.status(500).send(err);
    } else if (item) {
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
          res.status(200).send({ msg: "password restart success" });
        })
        .catch(err => {
          console.log("err+++++++===");
          console.log(err);
          res.status(500).send(err);
        });
    } else {
      res.status(404).send({ msg: "user not found" });
    }
  });
};
export const logout = (req, res) => {
  req.logout();
  req.session = null;
  res.status(200).send("Log out");
};
export const get = (req, res) => {
  console.log("list users");
  let rquery = ntype(req.query);
  let options = {};
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;
  delete rquery.page;
  delete rquery.limit;
  const type = req.query.type || "personal";
  let query = { ...rquery, type };
  if (type === "business") {
    query.users = { $in: [req.user._id] };
  }
  // query.name = req.query.name || null;
  // query.isActive = bool(req.query.active) || null;

  User.paginate(query, options, (err, item) => {
    if (err) {
      res.status(500).end();
    } else {
      res.send(item);
    }
  });
};
export const getOne = (req, res) => {
  console.log(req.params.id);

  const type = req.query.type || "personal";
  User.findOne({ _id: req.params.id, type })
    .populate("users")
    .exec((err, user) => {
      if (err) {
        res.status(500).send(err);
      } else if (user) {
        res.send(user.getUser());
      } else {
        res.status(404).send({ msg: "user not found" });
      }
    });
};
export const update = (req, res) => {
  User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .populate("currency")
    .exec((err, item) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(item);
      }
    });
};
export const business = (req, res) => {
  let update = {
    $addToSet: { business: req.body.business }
  };
  User.findByIdAndUpdate(req.params.id, update, { new: true }, (err, item) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(item);
    }
  });
};
export const user = (req, res) => {
  let update = {
    $addToSet: { users: req.body.user }
  };
  User.findByIdAndUpdate(req.params.id, update, { new: true }, (err, item) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(item);
    }
  });
};
export const scope = (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      scope: {
        type: req.body.type,
        id: req.body.id
      }
    },
    { new: true },
    (err, item) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(item);
      }
    }
  );
};
export const find = (req, res) => {
  const type = req.query.type || "personal";
  let query = {
    $and: [
      {
        $or: [
          { "emails.email": { $regex: req.params.q, $options: "i" } },
          { name: { $regex: req.params.q, $options: "i" } },
          { username: { $regex: req.params.q, $options: "i" } },
          { idNumber: { $regex: req.params.q, $options: "i" } }
        ]
      },
      { type }
    ]
  };
  User.paginate(query, {}, (err, items) => {
    if (err) {
      res.status(500).end();
    } else {
      res.send(items);
    }
  });
};
export const relationsFind = (req, res) => {
  let query = {
    $and: [
      {
        $or: [
          { "emails.email": { $regex: req.params.q, $options: "i" } },
          { name: { $regex: req.params.q, $options: "i" } },
          { username: { $regex: req.params.q, $options: "i" } },
          { idNumber: { $regex: req.params.q, $options: "i" } }
        ]
      },
      {
        "relations.id": req.user._id
      }
    ]
  };
  console.log(query);
  User.paginate(query, {}, (err, items) => {
    if (err) {
      res.status(500).end();
    } else {
      res.send(items);
    }
  });
};
export const lastItems = (req, res) => {
  Line.find({ creator: req.user._id, isParent: false })
    .sort({ updatedAt: -1 })
    .limit(100)
    .populate([{ path: "item" }, { path: "children" }])
    .exec((err, lines) => {
      if (err) {
        res.status(500).end();
      } else if (lines) {
        let docs = [];
        for (let line of lines) {
          if (line.item) {
            if (docs.filter(i => i._id === line.item._id).length === 0) {
              docs.push(line.item);
            }
          }
        }
        res.send(docs);
      } else {
        res.status(404).end({ msg: "not found" });
      }
    });
};
export const lastParents = (req, res) => {
  Line.find({ creator: req.user._id, isParent: true })
    .sort({ updatedAt: -1 })
    .limit(100)
    .populate([{ path: "item" }, { path: "children" }])
    .exec((err, lines) => {
      if (err) {
        res.status(500).end();
      } else if (lines) {
        let docs = [];
        for (let line of lines) {
          if (line.item) {
            if (docs.filter(i => i._id === line.item._id).length === 0) {
              docs.push(line.item);
            }
          }
        }

        Item.getWithChildren(docs)
          .then(resp => {
            res.send(resp);
          })
          .catch(err => {
            res.status(500).end();
          });

        // res.send(docs);
      } else {
        res.status(404).end({ msg: "not found" });
      }
    });
};
