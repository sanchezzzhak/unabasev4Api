import UserPermission from "../models/userPermission";

import jwt from "jsonwebtoken";
import envar from "./envar";
export const getUserData = data => {
  let user = {
    _id: data._id,
    isActive: data.isActive,
    name: data.name,
    username: data.username,
    idNumber: data.idNumber,
    phones: data.phones,
    emails: data.emails,
    scope: data.scope,
    type: data.type,
    address: data.address,
    lastLogin: data.lastLogin,
    imgUrl: data.imgUrl,
    google: {
      name: data.google.name,
      email: data.google.email,
      imgUrl: data.google.imgUrl
    },
    legalName: data.legalName,
    businessType: data.businessType,
    website: data.website,
    creator: data.creator,
    admins: data.admins,
    quantity: data.quantity,
    users: data.users,
    currency: data.currency,
    security: {
      updatedAt: data.security.updatedAt,
      isRandom: data.security.isRandom,
      hasPassword: data.password != null && data.password !== ""
    },
    otherAccounts: data.otherAccounts
  };
  return user;
};

export const getUserPermission = user => {
  return new Promise((resolve, reject) => {
    let userPermissions = UserPermission.find({ user: user._id, business: user.scope.id })
      .select("permission")
      .populate("permission")
      .exec((err, userPermissions) => {
        if (err) reject(err);
        resolve(userPermissions.map(userPermission => userPermission.permission));
      });
  });

  // return userPermissions.map(userPermission => userPermission.permission);
};

export const generateToken = (user, expiresIn = "3d") => {
  return jwt.sign({ user }, envar().SECRET, { expiresIn });
};
