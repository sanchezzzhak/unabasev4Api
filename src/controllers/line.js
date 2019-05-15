import Line from "../models/line";
import Movement from "../models/movement";
import Item from "../models/item";
import Currency from "../models/currency";

import { Types } from "mongoose";
const ObjectId = Types.ObjectId;

export const getOne = (req, res) => {
  Line.findOne({ _id: req.params.id })
    .populate({ path: "children" })
    .exec((err, line) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(line);
      }
    });
};

export function get(req, res) {
  let rquery = ntype(req.query);
  let options = {};
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;

  options.populate = [
    { path: "tax", select: "name number" },
    { path: "item" },
    {
      path: "children",
      populate: {
        path: "children",
        populate: { path: "children", populate: { path: "children", populate: "children" } }
      }
    }
  ];
  delete rquery.page;
  delete rquery.limit;
  let query = {
    ...rquery
  };
  console.log("query");
  console.log(query);
  Line.paginate(query, options, (err, items) => {
    if (err) {
      res.status(500).end();
    } else {
      res.json(items);
    }
  });
}
export function createMany(req, res) {
  Line.insertMany(req.body, async (err, lines) => {
    if (err) {
      res.status(500).send(err);
    } else {
      await Line.populate(lines, [{ path: "item" }, { path: "parent" }]);
      console.log("parent");
      console.log(req.body);
      Line.findByIdAndUpdate(req.body[0].parent, {
        $addToSet: { children: lines.map(line => line._id) }
      }).exec();
      res.send(lines);
    }
  });
}
export function create(req, res) {
  console.log("//////////////////////////// req.body from create");
  console.log(req.body);
  let line = new Line(req.body);
  let movementType = req.body.movementType === "income" ? "sell" : "buy";
  let currency = typeof req.body.currency === "object" ? req.body.currency._id : req.body.currency;
  line.creator = req.user._id;
  line.save((err, line) => {
    if (err) {
      res.status(500).send(err);
    } else {
      Item.findOne({ _id: req.body.item }).exec((err, item) => {
        if (err) {
          res.status(500).send(err);
        } else {
          if (item.global.length) {
            let index = item.global.map(i => i.currency.toString()).indexOf(currency);
            item.global[index].lastPrice[movementType] = line.price;
          }

          Line.findByIdAndUpdate(req.body.parent, {
            $addToSet: { children: line._id }
          }).exec();
          item.save((err, newItem) => {
            if (err) {
              res.status(500).send(err);
            } else {
              line.item = newItem;
              res.send(line);
            }
          });
        }
      });
    }
  });
}
export function updateMany(req, res) {
  Line.updateMany({ _id: { $in: req.body.lines } }, { $set: req.body.data }, async (err, lines) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      // Line.findByIdAndUpdate(req.body.lines[0].parent, {
      //   $addToSet: { children: lines.map(line => line._id) }
      // }).exec();
      await Line.populate(lines, [{ path: "parent" }]);
      res.send(lines);
    }
  });
}
export function deleteMany(req, res) {
  Line.deleteMany({ _id: { $in: req.body.lines.map(i => i._id) } }, (err, resp) => {
    if (err) {
      res.status(500).send(err);
    } else {
      for (let line of req.body.lines) {
        Line.findByIdAndUpdate(line.parent, { $pull: { children: { $in: line._id } } }).exec();
      }
      res.send(resp);
    }
  });
}

export function updateOne(req, res) {
  let movementType = req.body.movementType === "income" ? "sell" : "buy";
  let currency = typeof req.body.currency === "object" ? req.body.currency._id : req.body.currency;
  Line.findOneAndUpdate(
    { children: { $in: req.params.id }, _id: { $ne: req.body.parent } },
    { $pull: { children: { $in: req.params.id } } }
  ).exec();
  Line.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, line) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else if (line) {
      // add total to movement
      Movement.findByIdAndUpdate(line.movement, {
        total: req.body.totalMovement
      }).exec();
      Line.findById(req.body.parent, (err, parentLine) => {
        if (err) {
          res.status(500).send(err);
        } else {
          if (parentLine.children.indexOf(line._id) < 0) {
            parentLine.children.push(line._id);
            parentLine.save();
          }
          console.log("parentLine._id !== line.parent-------------");
          console.log(parentLine._id !== line.parent);
          console.log(parentLine._id);
          console.log(line.parent);

          Line.updateParentTotal(req.body.parent, () => {
            console.log("after update parent total!!!!!!!!!!!");
            if (typeof currency !== "undefined") {
              Item.findById(line.item.toString()).exec((err, item) => {
                if (err) {
                  res.status(500).send(err);
                } else {
                  let index = item.global.map(i => i.currency.toString()).indexOf(currency);

                  item.global[index].lastPrice[movementType] = line.numbers.price;
                  item.save();
                }
              });
            }

            line.populate([{ path: "item" }, { path: "children" }], err => {
              if (err) {
                console.log(err);
                res.status(500).send(err);
              } else {
                Line.getTreeTotals(line.movement)
                  .then(lineTree => {
                    console.log("before send responde");
                    res.send({ line, lineTree });
                  })
                  .catch(err => {
                    res.status(500).send(err);
                  });
              }
            });
          });
        }
      });
    }
  });
}

export function deleteOne(req, res) {
  Line.findByIdAndRemove(req.params.id, (err, item) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(item);
    }
  });
}
