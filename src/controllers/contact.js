import Contact from "../models/contact";
import ntype from "normalize-type";
import User from "../models/user";

export const get = (req, res) => {
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
    if (err) {
      res.status(500).end();
    } else {
      res.send(items);
    }
  });
};
export const getOne = (req, res) => {
  Contact.findById(req.params.id)
    .populate({
      path: "user",
      select: "name google.name google.email imgUrl emails phones"
    })
    .exec((err, item) => {
      if (err) {
        res.status(500).end({ err });
      } else if (item) {
        res.send(item);
      } else {
        res.status(404).end();
      }
    });
};
export const create = (req, res) => {
  let contact = new Contact(req.body);
  contact.creator = req.user._id;
  contact.save((err, item) => {
    if (err) {
      console.log(err);
      res.status(500).end({ err });
    } else {
      if (item.user && item.user !== "") {
        User.findByIdAndUpdate(item.user, { $addToSet: { contacts: item._id } }, { new: true }, (err, user) => {
          if (err) {
            res.status(500).end({ err });
          } else {
            item.populate([{ path: "user", select: "name google imgUrl emails" }], err => {
              res.send(item);
            });
          }
        });
      } else {
        res.send(item);
      }
    }
  });
};
export const find = (req, res) => {
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
      if (err) {
        res.status(500).end({ err });
      } else {
        res.send(items);
      }
    }
  );
};
export const findSelf = (req, res) => {
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
    ]
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
        },
        {
          path: "business",
          select: "name idNumber legalName"
        }
      ]
    },
    options,
    (err, items) => {
      if (err) {
        res.status(500).end({ err });
      } else {
        res.send(items);
      }
    }
  );
};
export const updateOne = (req, res) => {
  Contact.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, item) => {
    if (err) {
      res.status(500).end({ err });
    } else {
      res.send(item);
    }
  });
};
