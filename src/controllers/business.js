// @ts-nocheck

import Contact from "../models/contact";
import Business from "../models/business";
import User from "../models/user";

import { queryHelper } from "../lib/queryHelper";
import { createError } from "../lib/error";

export const create = (req, res, next) => {
  Business.findOne(
    {
      idNumber: req.body.idNumber
    },
    (err, business) => {
      if (err) next(err);

      if (business) next(createError(409, req.lg.business.alreadyExist));

      let newBusiness = new Business(req.body);
      newBusiness.creator = req.user.id;

      newBusiness.users = [
        {
          description: "creator",
          user: req.user.id
        }
      ];
      newBusiness.save((err, business) => {
        if (err) next(err);
        let contact = new Contact();
        contact.name = business.name;
        contact.business = business._id;
        contact.type = "Business";
        contact.save();
        User.addBusiness(req.user._id, business._id, () => {
          newBusiness.populate(
            [
              {
                path: "users.user",
                select: "name  phone email imgUrl emails type"
              }
            ],
            err => {
              if (err) next(err);
              res.send(business);
            }
          );
        });
      });
    }
  );
};
export const getOne = (req, res, next) => {
  Business.findOne(
    {
      _id: req.params.id
    },
    (err, business) => {
      if (err) next(err);
      if (!business) next(createError(404, req.lg.business.notExist));
      business.populate(
        [
          {
            path: "users.user",
            select: "name  phone email imgUrl emails type"
          }
        ],
        err => {
          res.send(business);
        }
      );
    }
  );
};
export const updateOne = (req, res, next) => {
  Business.findOneAndUpdate(
    {
      _id: req.params.id
    },
    req.body,
    {
      new: true
    }
  )
    .populate([
      {
        path: "users.user",
        select: "name  phone email imgUrl emails type"
      }
    ])
    .exec((err, item) => {
      if (err) next(err);
      res.send(item);
    });
};
export const get = (req, res, next) => {
  req.query["users.user"] = req.user.id;
  let helper = queryHelper(req.query, {});

  Business.paginate(helper.query, helper.optionsoptions, (err, item) => {
    if (err) next(err);
    res.send(item);
  });
};
// todo - user method can be used for the same action plus permissions asignment
// HECTOR - RUTA QUE AGREGA UN USUARIO A UNA EMPRESA
// export const addUserToBusiness = (req, res, next) => {
//   logy(req.body);
//   let user = {
//     description: req.body.role.name,
//     user: req.body.userToAdd
//   };
//   Business.findByIdAndUpdate(
//     req.params.id,
//     {
//       $push: {
//         users: user
//       }
//     },
//     {
//       new: true
//     },
//     (err, company) => {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         let permissionsArray = new Array();
//         for (let index = 0; index < req.body.role.permissions.length; index++) {
//           let permission = {
//             user: req.body.userToAdd._id,
//             business: req.body.business._id,
//             permission: req.body.role.permissions[index]._id
//           };
//           permissionsArray.push(permission);
//         }
//         User.addBusiness(req.body.userToAdd._id, req.body.business._id).exec();
//         UserPermissions.insertMany(permissionsArray, function(err, permissions) {
//           if (err) {
//             res.status(500).send(err);
//             logy(err);
//           } else {
//             res.send(permissions);
//           }
//         });
//       }
//     }
//   );
// };

export const user = (req, res, next) => {
  const action = req.body.action === "add" ? "$addToSet" : "$pull";
  let update = {
    [action]: {
      users: req.body.user
    }
  };

  Business.findByIdAndUpdate(
    req.params.id,
    update,
    {
      new: true
    },
    (err, item) => {
      if (err) next(err);
      User.findByIdAndUpdate(
        req.body.user,
        {
          [action]: {
            business: item._id
          }
        },
        {
          new: true
        },
        (err, user) => {
          if (err) next(err);
          res.send(item);
        }
      );
    }
  );
};
