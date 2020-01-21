import Item from "../models/item";
import ntype from "normalize-type";
import { createError } from "../lib/error";

export const get = (req, res, next) => {
  let rquery = ntype(req.query);
  let options = {};
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;
  options.sort = { updatedAt: -1 };

  options.populate = [
    {
      path: "taxes",
      select: "number name"
    },
    {
      path: "children"
    }
  ];
  delete rquery.page;
  delete rquery.limit;
  let query = { ...rquery, creator: req.user._id };
  Item.paginate(query, options, (err, taxes) => {
    if (err) next(err);
    res.send(taxes);
  });
};
export const getOne = (req, res, next) => {
  Item.findById(req.params.id)
    .populate({ path: "tax" })
    .exec((err, item) => {
      if (err) next(err);
      if (item) {
        item.populate(
          [
            {
              path: "global.taxes"
            },
            {
              path: "children"
            }
          ],
          err => {
            if (err) next(err);
            item.populate(
              [
                {
                  path: "global.currency"
                },
                {
                  path: "global.taxes"
                }
              ],
              err => {
                res.send(item);
              }
            );
          }
        );
      } else {
        return next(createError(404, "Item not found"));
      }
    });
};
export const create = (req, res, next) => {
  Item.findOne({ name: { $regex: new RegExp(`^${req.body.name}$`, "i") } }, (err, itemFound) => {
    if (err) {
      console.log(err);
      res.status(500).end({ err });
    } else if (itemFound) {
      res.send(itemFound);
    } else {
      let item = new Item(req.body);
      item.creator = req.user._id;
      item.save((err, itemSaved) => {
        if (err) next(err);
        item.populate(
          [
            {
              path: "global.currency"
            },
            {
              path: "global.taxes"
            }
          ],
          err => {
            res.send(itemSaved);
          }
        );
      });
    }
  });
};
export const updateOne = (req, res, next) => {
  Item.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, item) => {
    if (err) next(err);
    item.populate(
      [
        {
          path: "global.currency"
        },
        {
          path: "global.taxes"
        },
        {
          path: "children"
        }
      ],
      err => {
        res.send(item);
      }
    );
  });
};
export const find = (req, res, next) => {
  let rquery = ntype(req.query);

  let query = {
    name: { $regex: req.params.q, $options: "i" },
    ...rquery
  };
  Item.paginate(
    query,
    {
      populate: [
        {
          path: "children"
        }
      ]
    },
    (err, items) => {
      if (err) next(err);
      res.send(items);
    }
  );
};
