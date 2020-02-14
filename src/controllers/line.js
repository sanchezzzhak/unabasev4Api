import Line from "../models/line";
import Movement from "../models/movement";
// import Item from "../models/item";
// import Currency from "../models/currency";

import { Types } from "mongoose";
import { checkGlobal } from "../lib/checkGlobal";
import { calculateTotalMovement } from "../lib/movement";
import { createError } from "../lib/error";
import { queryHelper } from "../lib/queryHelper";
import { getLocationByIp } from "../lib/location";
import Contact from "../models/contact";
import Item from "../models/item";
import { checkDraftState } from "../middleware/movement";
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

export const getLinesByMovement = async (req, res, next) => {
  Line.find({ movement: req.params.movement })
    .populate("movement", "name _id")
    // .populate("item")
    .exec((err, lines) => {
      if (err) return next(err);

      res.send(lines);
    });

  // Line.aggregate([
  //   {
  //     $match: {
  //       $and: [{ movement: req.params.movement }]
  //     }
  //   },
  //   {
  //     $lookup: { from: Movement.collection.name, localField: "movement", foreignField: "_id", as: "movement" }
  //   }
  // ]).exec((err, lines) => {
  //   if (err) return next(err);
  //   res.send(lines);
  // });
};
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

    // checkGlobal(req.body.movement)
    //   .then(_ => {
    //   })
    //   .catch(err => {
    //     return next(err);
    //   });

    // ------ se debe copiar el impuesto y valores del item en catalogo a cada linea. ------------

    // ------ se debe calcular los totales del movimiento ------------

    // deprecated, taxes must live in the lines model from the invoice document, not in the item model
    // lines.forEach(line => {
    //   let global = line.item.global.filter(i => i.currency.toString() === req.currency._id.toString());
    //   line.numbers.price = global[0].estimate.sell.price.isActive ? global[0].estimate.sell.price.number : 0;
    //   global[0].taxes.forEach(tax => {
    //     line.taxes.push({
    //       tax: tax._id,
    //       price: line.quantity * line.numbers.price * (tax.number / 100)
    //     });
    //   });
    //   line.save();
    // });
    calculateTotalMovement(req.body.movement)
      .then(movement => {
        res.send({ lines, movement });
        // res.send(lines);
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
                logy("before send responde");
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
            logy("before send responde");
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
      logy("////////////////////lines");
      logy(lines);
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
          logy("before send responde");
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
        logy("before send responde");
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
export async function updateOne(req, res, next) {
  logy("-------------start updateOne");
  // let movementType = req.body.movementType === "income" ? "sell" : "buy";
  // let currency = typeof req.body.currency === "object" ? req.body.currency._id : req.body.currency;
  // let item = typeof req.body.item === "object" ? req.body.item._id : req.body.item;
  logy("before  update parent");
  // if (req.body.numers.price)
  Line.findOneAndUpdate(
    {
      _id: req.params.id
    },
    req.body,
    // { new: true },
    async (err, line) => {
      if (err) return next(err);

      if (line) {
        // let movement = await Movement.findById(line.movement, "_id state").lean();
        let movement;
        if (req.body.numbers?.price) {
          movement = await Movement.findByIdAndUpdate(line.movement, { $set: { state: "budget" } }, { $fields: { _id: 1, state: 1 } }).lean();
        }
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
                },
                {
                  path: "movement",
                  select: "_id state"
                }
              ],
              err => {
                if (err) return next(err);
                if (line.parent) {
                  updateOldParent(line.parent, () => {
                    Line.getTreeTotals(line.movement)
                      .then(lineTree => {
                        logy("before send responde");
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
                      logy("before send responde");

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
              },
              {
                path: "movement",
                select: "_id state"
              }
            ],
            err => {
              if (err) return next(err);
              calculateTotalMovement(line.movement._id.toString())
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
        return next(createError(404, req.lg.line.notFound));
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
        logy("before send responde");
        res.send({
          lineTree
        });
      })
      .catch(err => {
        return next(err);
      });
  });
}

export const requestBudget = async (req, res, next) => {
  // const originMovement = await Movement.findById(req.body.movement).exec();
  // const contact = await Contact.findById(req.body.contact).exec();
  // const lines = await Line.find({ _id: { $in: req.body.lines } })
  //   .select("name item")
  //   .populate("item")
  //   .lean();
  const [originMovement, contact, lines] = await Promise.all([
    Movement.findById(req.body.movement).exec(),
    Contact.findById(req.body.contact).exec(),
    Line.find({ _id: { $in: req.body.lines } })
      .select("name item")
      .populate("item")
      .lean()
  ]);
  let movement = new Movement({
    name: `Solicitud de ${req.user.name} / ${originMovement.name}`,
    creator: req.user._id,
    currency: originMovement.currency,
    "client.user": req.user._id,
    "responsable.user": contact.user,
    "responsable.contact": contact._id,
    state: "draft"
  });
  const movementCreated = await movement.save();
  for await (let line of lines) {
    const createLine = (item, line, creator, movement) => {
      let newLine = new Line({
        name: line.name,
        item: item,
        clientLine: line._id,
        creator,
        movement
      });
      newLine.save();
    };
    let itemFound = await Item.findOne({ name: line.item.name, creator: contact.user }).exec();
    if (itemFound) {
      createLine(itemFound._id, line, contact.user._id, movementCreated._id.toString());
    } else {
      let item = new Item({
        name: line.name,
        creator: contact.user,
        global: [
          {
            currency: originMovement.currency
          }
        ]
      });
      let itemCreated = await item.save();
      createLine(itemCreated._id, line, contact.user._id, movementCreated._id.toString());
    }
  }
  const linesCreated = await Line.find({ movement: movementCreated._id.toString() }).exec();
  res.send({ success: lines.length === linesCreated.length });
};
