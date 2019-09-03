import Line from "../models/line";
import Movement from "../models/movement";
import Item from "../models/item";
import Currency from "../models/currency";

import { Types } from "mongoose";
const ObjectId = Types.ObjectId;

export const getOne = (req, res) => {
  Line.findOne({
    _id: req.params.id
  })
    .populate({
      path: "children item"
    })
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
  for (let line of req.body.lines) {
    line.creator = req.user._id;
  }
  Line.insertMany(req.body.lines, async (err, lines) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      await Line.populate(lines, [
        {
          path: "item"
        }
      ]);
      // Line.findByIdAndUpdate(req.body.lines[0].parent, {
      //   $addToSet: {
      //     children: lines.map(line => line._id)
      //   }
      // }).exec();

      res.send(lines);
    }
  });
}

export function group(req, res) {
  let line = new Line(req.body);
  line.creator = req.user._id;
  line.save((err, line) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
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
        if (err) {
        } else {
          Line.updateParentTotal(line._id, err => {
            if (err) {
              console.log(err);
              res.status(500).send(err);
            } else {
              line.populate(
                [
                  {
                    path: "item"
                  }
                ],
                err => {
                  if (err) {
                    console.log(err);
                    res.status(500).send(err);
                  } else {
                    Line.getTreeTotals(line.movement)
                      .then(lineTree => {
                        console.log("before send responde");
                        res.send({
                          line,
                          lineTree
                        });
                      })
                      .catch(err => {
                        res.status(500).send(err);
                      });
                  }
                }
              );
            }
          });
        }
      });
    }
  });
}
export function createParent(req, res) {
  let parent = new Line(req.body.parent);
  parent.creator = req.user._id;
  parent.save((err, line) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      for (let child of req.body.children) {
        child.creator = req.user._id;
        child.parent = line._id;
      }
      Line.insertMany(req.body.children, async (err, lines) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          await Line.populate(lines, [
            {
              path: "item"
            }
          ]);
          lines.push(parent);
          res.send(lines);
        }
      });
    }
  });
}

export function create(req, res) {
  let currency = typeof req.body.currency === "object" ? req.body.currency._id : req.body.currency;

  let line = new Line(req.body);
  // let movementType = req.body.movementType === "income" ? "sell" : "buy";
  // let currency = typeof req.body.currency === "object" ? req.body.currency._id : req.body.currency;
  line.creator = req.user._id;
  line.save((err, line) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
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
          if (err) {
            console.log(err);
            res.status(500).send(err);
          } else {
            Line.getTreeTotals(line.movement)
              .then(lineTree => {
                console.log("before send responde");
                res.send({
                  line,
                  lineTree
                });
              })
              .catch(err => {
                res.status(500).send(err);
              });
          }
        }
      );
    }
  });
}
export function updateMany(req, res) {
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
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
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
    }
  );
}
export function deleteMany(req, res) {
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
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
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
            console.log(err);
            res.status(500).send(err);
          });
      }
    }
  );
}

export async function move(req, res) {
  const getTreeTotals = () => {
    Line.getTreeTotals(req.body.movement)
      .then(lineTree => {
        console.log("before send responde");
        res.send({
          lineTree
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });
  };

  const updateParent = () => {
    return new Promise((resolve, reject) => {
      if (req.body.parent) {
        Line.updateParentTotal(req.body.parent, err => {
          if (err) {
            console.log(err);
            // res.status(500).send(err);
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
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        updateParent()
          .then(resp => {
            getTreeTotals();
          })
          .catch(err => {
            res.status(500).send(err);
          });
      }
    });
  } else {
    updateParent()
      .then(resp => {
        getTreeTotals();
      })
      .catch(err => {
        res.status(500).send(err);
      });
  }
}

//deprecated
// export function move(req, res) {
//   const oldParent = req.body.children[0].parent;
//   const getLineTree = movement => {
//     Line.getTreeTotals(movement)
//       .then(lineTree => {
//         console.log("before send responde");
//         res.send({
//           lineTree
//         });
//       })
//       .catch(err => {
//         console.log(err);
//         res.status(500).send(err);
//       });
//   };
//   const updateNewParent = () => {
//     if (req.body.parent) {
//       Line.updateParentTotal(req.body.parent, (err, parent) => {
//         if (err) {
//           console.log(err);
//           res.status(500).send(err);
//         } else {
//           getLineTree(parent.movement);

//         }
//       });
//     } else {
//       getLineTree(req.body.children[0].movement);
//     }
//   };
//   Line.updateMany(
//     {
//       _id: {
//         $in: req.body.children
//       }
//     },
//     {
//       parent: req.body.parent
//     },
//     (err, resp) => {
//       if (oldParent) {
//         Line.updateParentTotal(oldParent, (err, oldParent) => {
//           if (err) {
//             console.log(err);
//             res.status(500).send(err);
//           } else {
//             updateNewParent();
//           }
//         });
//       } else {
//         updateNewParent();
//       }
//     }
//   );
// }
export function updateOne(req, res) {
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
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else if (line) {
        if (req.body.parent || line.parent) {
          const updateOldParent = (oldParent, callback) => {
            Line.updateParentTotal(oldParent, err => {
              if (err) {
                console.log(err);
                res.status(500).send(err);
              } else {
                callback();
              }
            });
          };
          // const parentToUpdate = req.body.parent || line.parent || "";
          Line.updateParentTotal(req.body.parent, err => {
            if (err) {
              console.log(err);
              res.status(500).send(err);
            } else {
              line.populate(
                [
                  {
                    path: "item"
                  }
                ],
                err => {
                  if (err) {
                    console.log(err);
                    res.status(500).send(err);
                  } else {
                    if (line.parent) {
                      updateOldParent(line.parent, () => {
                        Line.getTreeTotals(line.movement)
                          .then(lineTree => {
                            console.log("before send responde");
                            res.send({
                              line,
                              lineTree
                            });
                          })
                          .catch(err => {
                            res.status(500).send(err);
                          });
                      });
                    } else {
                      Line.getTreeTotals(line.movement)
                        .then(lineTree => {
                          console.log("before send responde");
                          res.send({
                            line,
                            lineTree
                          });
                        })
                        .catch(err => {
                          res.status(500).send(err);
                        });
                    }
                  }
                }
              );
            }
          });
        } else {
          line.populate(
            [
              {
                path: "item"
              }
            ],
            err => {
              if (err) {
                console.log(err);
                res.status(500).send(err);
              } else {
                res.send({
                  line
                });
              }
            }
          );
        }
      } else {
        res.status(500).send({
          msg: "Line not found"
        });
      }
    }
  );
}

export function deleteOne(req, res) {
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
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      Line.getTreeTotals(req.body.movement || "")
        .then(lineTree => {
          console.log("before send responde");
          res.send({
            lineTree
          });
        })
        .catch(err => {
          res.status(500).send(err);
        });
    }
  });
}
