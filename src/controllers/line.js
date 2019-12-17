import Line from "../models/line";
import Movement from "../models/movement";
// import Item from "../models/item";
// import Currency from "../models/currency";

import { Types } from "mongoose";
import { checkGlobal } from "../lib/checkGlobal";
import { calculateTotalMovement } from "../lib/movement";
import { createError } from "../lib/error";
import { queryHelper } from "../lib/queryHelper";
const ObjectId = Types.ObjectId;

export const getOne = (req, res, next) => {
  Line.findOne({
    _id: req.params.id
  })
    .populate({
      path: "children"
    })
    .exec((err, line) => {
      if (err) return next(err);
      res.send(line);
    });
};

export function get(req, res, next) {
  let populate = [
    {
      path: "tax",
      select: "name number"
    },
    {
      path: "item"
    },
    {
      path: "children",
      populate: {
        path: "children",
        populate: {
          path: "children",
          populate: {
            path: "children",
            populate: "children"
          }
        }
      }
    }
  ];
  let helper = queryHelper(req, query, { populate });
  Line.paginate(helper.query, helper.options, (err, items) => {
    if (err) return next(err);
    res.json(items);
  });
}

export function getLinesByMovement(req, res, next) {
  Line.find({ movement: req.params.movement }, (err, lines) => {
    if (err) return next(err);
    res.json(lines);
  });
}
export function createMany(req, res, next) {
  for (let line of req.body.lines) {
    line.creator = req.user._id;
  }
  // TODO check if all the lines are getting the creator data
  Line.insertMany(req.body.lines, async (err, lines) => {
    if (err) return next(err);

    await Line.populate(lines, [
      {
        path: "item"
      }
    ]);

    checkGlobal(req.body.movement)
      .then(resp => {
        // ------ se debe copiar el impuesto y valores del item en catalogo a cada linea. ------------

        // ------ se debe calcular los totales del movimiento ------------
        lines.forEach(line => {
          let global = line.item.global.filter(i => i.currency.toString() === req.currency._id.toString());
          line.numbers.price = global[0].estimate.sell.price.isActive ? global[0].estimate.sell.price.number : 0;
          global[0].taxes.forEach(tax => {
            line.taxes.push({
              tax: tax._id,
              price: line.quantity * line.numbers.price * (tax.number / 100)
            });
          });
          line.save();
        });
        calculateTotalMovement(req.body.movement)
          .then(movement => {
            res.send({ lines, movement });
            // res.send(lines);
          })
          .catch(err => {
            return next(err);
          });
      })
      .catch(err => {
        return next(err);
      });
  });
}

export function group(req, res, next) {
  let line = new Line(req.body);
  line.creator = req.user._id;
  line.save((err, line) => {
    if (err) return next(err);
    Line.updateMany(
      {
        _id: {
          $in: req.body.children
        }
      },
      {
        parent: line._id
      }
    ).exec((err, lines) => {
      if (err) return next(err);
      Line.updateParentTotal(line._id, err => {
        if (err) return next(err);
        line.populate(
          [
            {
              path: "item"
            }
          ],
          err => {
            if (err) return next(err);
            Line.getTreeTotals(line.movement)
              .then(lineTree => {
                console.log("before send responde");
                res.send({
                  line,
                  lineTree
                });
              })
              .catch(err => {
                return next(err);
              });
          }
        );
      });
    });
  });
}
export function createParent(req, res, next) {
  let parent = new Line(req.body.parent);
  parent.creator = req.user._id;
  parent.save((err, line) => {
    if (err) return next(err);
    for (let child of req.body.children) {
      child.creator = req.user._id;
      child.parent = line._id;
    }
    Line.insertMany(req.body.children, async (err, lines) => {
      if (err) return next(err);
      await Line.populate(lines, [
        {
          path: "item"
        }
      ]);
      lines.push(parent);
      res.send(lines);
    });
  });
}

export function create(req, res, next) {
  let currency = typeof req.body.currency === "object" ? req.body.currency._id : req.body.currency;

  let line = new Line(req.body);
  // let movementType = req.body.movementType === "income" ? "sell" : "buy";
  // let currency = typeof req.body.currency === "object" ? req.body.currency._id : req.body.currency;
  line.creator = req.user._id;
  line.save((err, line) => {
    if (err) return next(err);
    if (line.parent) {
      Line.findByIdAndUpdate(line.parent, {
        $addToSet: {
          children: line._id
        }
      }).exec();
    }
    line.populate(
      [
        {
          path: "item"
        }
      ],
      err => {
        if (err) return next(err);
        Line.getTreeTotals(line.movement)
          .then(lineTree => {
            console.log("before send responde");
            res.send({
              line,
              lineTree
            });
          })
          .catch(err => {
            return next(err);
          });
      }
    );
  });
}
export function updateMany(req, res, next) {
  if (req.body.data.totalMovement) {
    Movement.findByIdAndUpdate(req.body.lines[0].movement, {
      total: req.body.data.totalMovement
    }).exec();
  }

  Line.updateMany(
    {
      _id: {
        $in: req.body.lines
      }
    },
    {
      $set: req.body.data
    },
    async (err, lines) => {
      if (err) return next(err);
      console.log("////////////////////lines");
      console.log(lines);
      Line.findByIdAndUpdate(req.body.lines[0].parent, {
        $addToSet: {
          children: req.body.lines.map(line => line._id)
        }
      }).exec();
      await Line.populate(lines, [
        {
          path: "parent"
        }
      ]);
      res.send(lines);
    }
  );
}
export function deleteMany(req, res, next) {
  if (req.body.totalMovement) {
    Movement.findByIdAndUpdate(req.body.movement, {
      total: req.body.totalMovement
    }).exec();
  }
  Line.deleteMany(
    {
      _id: {
        $in: req.body.lines.map(i => i._id)
      }
    },
    (err, resp) => {
      if (err) return next(err);
      for (let line of req.body.lines) {
        Line.findByIdAndUpdate(line.parent, {
          $pull: {
            children: {
              $in: line._id
            }
          }
        }).exec();
      }

      Line.getTreeTotals(req.body.movement || "")
        .then(lineTree => {
          console.log("before send responde");
          res.send({
            lineTree
          });
        })
        .catch(err => {
          return next(err);
        });
    }
  );
}

export async function move(req, res, next) {
  const getTreeTotals = () => {
    Line.getTreeTotals(req.body.movement)
      .then(lineTree => {
        console.log("before send responde");
        res.send({
          lineTree
        });
      })
      .catch(err => {
        return next(err);
      });
  };

  const updateParent = () => {
    return new Promise((resolve, reject) => {
      if (req.body.parent) {
        Line.updateParentTotal(req.body.parent, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  };
  for await (let child of req.body.children) {
    Line.findByIdAndUpdate(child._id, { ...child, parent: req.body.parent || null }).exec();
  }
  if (req.body.oldParent) {
    Line.updateParentTotal(req.body.oldParent, err => {
      if (err) return next(err);
      updateParent()
        .then(resp => {
          getTreeTotals();
        })
        .catch(err => {
          return next(err);
        });
    });
  } else {
    updateParent()
      .then(resp => {
        getTreeTotals();
      })
      .catch(err => {
        return next(err);
      });
  }
}

// TODO must be optimized ! ! !
export function updateOne(req, res, next) {
  console.log("-------------start updateOne");
  let movementType = req.body.movementType === "income" ? "sell" : "buy";
  let currency = typeof req.body.currency === "object" ? req.body.currency._id : req.body.currency;
  let item = typeof req.body.item === "object" ? req.body.item._id : req.body.item;
  console.log("before  update parent");

  Line.findOneAndUpdate(
    {
      _id: req.params.id
    },
    req.body,
    // { new: true },
    (err, line) => {
      if (err) return next(err);

      if (line) {
        if (req.body.parent || line.parent) {
          const updateOldParent = (oldParent, callback) => {
            Line.updateParentTotal(oldParent, err => {
              if (err) return next(err);
              callback();
            });
          };
          // const parentToUpdate = req.body.parent || line.parent || "";
          Line.updateParentTotal(req.body.parent, err => {
            if (err) return next(err);
            line.populate(
              [
                {
                  path: "item"
                }
              ],
              err => {
                if (err) return next(err);
                if (line.parent) {
                  updateOldParent(line.parent, () => {
                    Line.getTreeTotals(line.movement)
                      .then(lineTree => {
                        console.log("before send responde");
                        calculateTotalMovement(req.body.movement)
                          .then(movement => {
                            res.send({
                              line,
                              lineTree,
                              movement
                            });
                          })
                          .catch(err => {
                            return next(err);
                          });
                      })
                      .catch(err => {
                        return next(err);
                      });
                  });
                } else {
                  Line.getTreeTotals(line.movement)
                    .then(lineTree => {
                      console.log("before send responde");

                      calculateTotalMovement(req.body.movement)
                        .then(movement => {
                          res.send({
                            line,
                            lineTree,
                            movement
                          });
                        })
                        .catch(err => {
                          return next(err);
                        });
                    })
                    .catch(err => {
                      return next(err);
                    });
                }
              }
            );
          });
        } else {
          line.populate(
            [
              {
                path: "item"
              }
            ],
            err => {
              if (err) return next(err);
              calculateTotalMovement(req.body.movement)
                .then(movement => {
                  res.send({ line, movement });
                  // res.send(lines);
                })
                .catch(err => {
                  return next(err);
                });
            }
          );
        }
      } else {
        return next(createError(404, "Line not found"));
      }
    }
  );
}

export function deleteOne(req, res, next) {
  if (req.body.totalMovement) {
    Movement.findByIdAndUpdate(req.body.movement, {
      total: req.body.totalMovement
    }).exec();
  }
  Line.findOneAndUpdate(
    {
      children: {
        $in: req.params.id
      }
    },
    {
      $pull: {
        children: {
          $in: req.params.id
        }
      }
    }
  ).exec();
  Line.findByIdAndRemove(req.params.id, (err, item) => {
    if (err) return next(err);
    Line.getTreeTotals(req.body.movement || "")
      .then(lineTree => {
        console.log("before send responde");
        res.send({
          lineTree
        });
      })
      .catch(err => {
        return next(err);
      });
  });
}
