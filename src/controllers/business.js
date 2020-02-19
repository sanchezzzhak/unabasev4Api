// @ts-nocheck
import ntype from "normalize-type";
import Contact from "../models/contact";
import Business from "../models/business";
import User from "../models/user";
import UserPermissions from "../models/userPermission";
import business from "../routes/business";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;
// export default {
//   create: (req, res) => {
//     Business.findOne(
//       {
//         idNumber: req.body.idNumber
//       },
//       (err, business) => {
//         if (err) throw err;

//         if (business) {
//           res.status(409).send({
//             msg: "Business already exist"
//           });
//         } else if (typeof req.body.idNumber === "undefined") {
//           res.send({
//             msg: "You must enter an id number"
//           });
//         } else {
//           let newBusiness = new Business(req.body);
//           newBusiness.creator = req.user._id;
//           logy("//");
//           logy(req.user._id);
//           newBusiness.users = [
//             {
//               description: "creator",
//               user: req.user._id
//             }
//           ];
//           logy(newBusiness.users);
//           newBusiness.save((err, business) => {
//             if (err) {
//               logy(err);
//               res.status(500).end({
//                 err
//               });
//             } else {
//               let contact = new Contact();
//               contact.name = business.name;
//               contact.business = business._id;
//               contact.type = "Business";
//               contact.save();
//               User.addBusiness(req.user._id, business._id, () => {
//                 newBusiness.populate(
//                   [
//                     {
//                       path: "users.user",
//                       select: "name  phone email imgUrl emails type"
//                     }
//                   ],
//                   err => {
//                     if (err) {
//                       logy(err);
//                       res.status(500).end({
//                         err
//                       });
//                     } else {
//                       res.send(business);
//                     }
//                   }
//                 );
//               });
//             }
//           });
//         }
//       }
//     );
//   },
//   getOne: (req, res) => {
//     Business.findOne(
//       {
//         _id: req.params.id
//       },
//       (err, business) => {
//         if (err) {
//           res.status(500).send(err);
//         } else if (business) {
//           business.populate(
//             [
//               {
//                 path: "users.user",
//                 select: "name  phone email imgUrl emails type"
//               }
//             ],
//             err => {
//               res.send(business);
//             }
//           );
//         } else {
//           res.status(404).end("business not found");
//         }
//       }
//     );
//   },
//   updateOne: (req, res) => {
//     Business.findOneAndUpdate(
//       {
//         _id: req.params.id
//       },
//       req.body,
//       {
//         new: true
//       }
//     )
//       .populate([
//         {
//           path: "users.user",
//           select: "name  phone email imgUrl emails type"
//         }
//       ])
//       .exec((err, item) => {
//         if (err) {
//           res.status(500).send(err);
//         } else {
//           res.send(item);
//         }
//       });
//   },
//   get: (req, res) => {
//     logy("req ---> ", req);
//     let rquery = ntype(req.query);
//     let options = {};
//     options.page = rquery.page || 1;
//     options.limit = rquery.limit || 20;
//     delete rquery.page;
//     delete rquery.limit;

//     rquery.$or = [
//       {
//         "users.user": ObjectId(`${req.user._id}`)
//       }
//     ];

//     Business.paginate(rquery, options, (err, item) => {
//       if (err) {
//         logy(err);
//         res.status(500).end(req);
//       } else {
//         res.send(item);
//       }
//     });
//   },
//   // todo - user method can be used for the same action plus permissions asignment
//   // HECTOR - RUTA QUE AGREGA UN USUARIO A UNA EMPRESA
//   addUserToBusiness: (req, res) => {
//     logy(req.body);
//     let user = {
//       description: req.body.role.name,
//       user: req.body.userToAdd
//     };
//     Business.findByIdAndUpdate(
//       req.params.id,
//       {
//         $push: {
//           users: user
//         }
//       },
//       {
//         new: true
//       },
//       (err, company) => {
//         if (err) {
//           res.status(500).send(err);
//         } else {
//           let permissionsArray = new Array();
//           for (let index = 0; index < req.body.role.permissions.length; index++) {
//             let permission = {
//               user: req.body.userToAdd._id,
//               business: req.body.business._id,
//               permission: req.body.role.permissions[index]._id
//             };
//             permissionsArray.push(permission);
//           }
//           User.addBusiness(req.body.userToAdd._id, req.body.business._id).exec();
//           UserPermissions.insertMany(permissionsArray, function(err, permissions) {
//             if (err) {
//               res.status(500).send(err);
//               logy(err);
//             } else {
//               res.send(permissions);
//             }
//           });
//         }
//       }
//     );
//   },

//   user: (req, res) => {
//     const action = req.body.action === "add" ? "$addToSet" : "$pull";
//     let update = {
//       [action]: {
//         users: req.body.user
//       }
//     };

//     Business.findByIdAndUpdate(
//       req.params.id,
//       update,
//       {
//         new: true
//       },
//       (err, item) => {
//         if (err) {
//           res.status(500).send(err);
//         } else {
//           User.findByIdAndUpdate(
//             req.body.user,
//             {
//               [action]: {
//                 business: item._id
//               }
//             },
//             {
//               new: true
//             },
//             (err, user) => {
//               if (err) {
//                 res.status(500).send(err);
//               } else {
//                 res.send(item);
//               }
//             }
//           );
//         }
//       }
//     );
//   }
// };
export const create = (req, res, next) => {
  Business.findOne(
    {
      idNumber: req.body.idNumber
    },
    (err, business) => {
      if (err) next(err);

      if (business) {
        res.status(409).send({
          msg: "Business already exist"
        });
      } else if (typeof req.body.idNumber === "undefined") {
        res.status(400).send({
          msg: "You must enter an id number"
        });
      } else {
        let newBusiness = new Business(req.body);
        newBusiness.creator = req.user._id;
        logy("//");
        logy(req.user._id);
        newBusiness.users = [
          {
            description: "creator",
            user: req.user._id
          }
        ];
        logy(newBusiness.users);
        newBusiness.save((err, business) => {
          if (err) {
            logy(err);
            res.status(500).end({
              err
            });
          } else {
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
                  if (err) {
                    logy(err);
                    res.status(500).end({
                      err
                    });
                  } else {
                    res.send(business);
                  }
                }
              );
            });
          }
        });
      }
    }
  );
};
export const getOne = (req, res, next) => {
  Business.findOne(
    {
      _id: req.params.id
    },
    (err, business) => {
      if (err) {
        res.status(500).send(err);
      } else if (business) {
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
      } else {
        res.status(404).end("business not found");
      }
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
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(item);
      }
    });
};
export const get = (req, res, next) => {
  logy("req ---> ", req);
  let rquery = ntype(req.query);
  let options = {};
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;
  delete rquery.page;
  delete rquery.limit;

  rquery.$or = [
    {
      "users.user": ObjectId(`${req.user._id}`)
    }
  ];

  Business.paginate(rquery, options, (err, item) => {
    if (err) {
      logy(err);
      res.status(500).end(req);
    } else {
      res.send(item);
    }
  });
};
// todo - user method can be used for the same action plus permissions asignment
// HECTOR - RUTA QUE AGREGA UN USUARIO A UNA EMPRESA
export const addUserToBusiness = (req, res, next) => {
  logy(req.body);
  let user = {
    description: req.body.role.name,
    user: req.body.userToAdd
  };
  Business.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        users: user
      }
    },
    {
      new: true
    },
    (err, company) => {
      if (err) {
        res.status(500).send(err);
      } else {
        let permissionsArray = new Array();
        for (let index = 0; index < req.body.role.permissions.length; index++) {
          let permission = {
            user: req.body.userToAdd._id,
            business: req.body.business._id,
            permission: req.body.role.permissions[index]._id
          };
          permissionsArray.push(permission);
        }
        User.addBusiness(req.body.userToAdd._id, req.body.business._id).exec();
        UserPermissions.insertMany(permissionsArray, function(err, permissions) {
          if (err) {
            res.status(500).send(err);
            logy(err);
          } else {
            res.send(permissions);
          }
        });
      }
    }
  );
};

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
      if (err) {
        res.status(500).send(err);
      } else {
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
            if (err) {
              res.status(500).send(err);
            } else {
              res.send(item);
            }
          }
        );
      }
    }
  );
};
