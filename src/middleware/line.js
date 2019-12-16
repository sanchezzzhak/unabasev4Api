import Line from "../models/line";
import Movement from "../models/movement";
import Item from "../models/item";

export function checkItem(req, res, next) {
  console.log("middleware checkItem");
  console.log(req.body);
  let currency = typeof req.body.currency === "object" ? req.body.currency._id : req.body.currency;
  if (!req.body.item) {
    Item.findOne({
      name: {
        $regex: req.body.name,
        $options: "i"
      }
    }).exec((err, item) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else if (item) {
        req.body.item = item._id;
      } else {
        let item = new Item({
          name: req.body.name,
          isParent: true
        });
        item.global.push({
          currency
        });
        item.save((err, item) => {
          if (err) {
            console.log(err);
            res.status(500).send(err);
          } else {
            req.body.item = item._id;
          }
        });
      }
      next();
    });
  } else {
    next();
  }
}

// export function updateOldParent(req, res, next) {
//   Line.findById(req.body.children[0]._id, (err, line) => {
//     if (line.parent) {
//       Line.updateParentTotal(line._id, err => {
//         if (err) {
//           console.log(err);
//           res.status(500).send(err);
//         } else {
//           next();
//         }
//       });
//     } else {
//       next();
//     }
//   });
// }
export function getCurrencyFromMovement(req, res, next) {
  if (req.body.movement) {
    Movement.findById(req.body.movement)
      .populate("currency")
      .exec((err, movement) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          req.currency = movement.currency;
          next();
        }
      });
  } else {
    next();
  }
}
export function updateMovementState(req, res, next) {
  if (req.body.movement) {
    // let movementId = Array.isArray(req.body.movement) ? req.body[0].movement : req.body.movement;
    Movement.updateOne(
      {
        _id: req.body.movement
      },
      {
        state: "budget"
      }
    ).exec((err, movement) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      next();
    });
  } else {
    next();
  }
}

// TODO remove if the calculation if done in the update of the line
export function updateTotalMovement(req, res, next) {
  console.log("before  update totalmovement");
  if (req.body.totalMovement) {
    Movement.findByIdAndUpdate(req.body.movement, {
      total: req.body.totalMovement
    }).exec((err, movement) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      next();
    });
  } else {
    next();
  }
}

export function updateItemLastPrice(req, res, next) {
  let movementType = req.body.movementType === "income" ? "sell" : "buy";
  let currency = typeof req.body.currency === "object" ? req.body.currency._id : req.body.currency;
  let item = typeof req.body.item === "object" ? req.body.item._id : req.body.item;

  if (currency) {
    Item.updateLastPrice(item, currency, movementType, req.body.numbers.price)
      .then(resp => {
        next();
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });
  } else {
    next();
  }
}

// TODO check if is necesary on the put and the post or just one of the routes
export function checkParent(req, res, next) {
  if (req.body.parent) {
    Line.findByIdAndUpdate(
      req.body.parent,
      {
        isParent: true,
        numbers: {
          price: 0,
          cost: 0,
          budget: 0
        },
        quantity: 0
      },
      (err, parent) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        }
        next();
      }
    );
  } else {
    next();
  }
}

export function updateOldParent(req, res, next) {
  if (req.body.oldParent) {
    Line.updateParentTotal(req.body.oldParent, err => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        next();
      }
    });
  } else {
    next();
  }
}
