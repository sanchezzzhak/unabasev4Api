import Notification from "../models/notification";
import Relation from '../models/relation'
import { queryHelper } from "../lib/queryHelper";

export const get = async (req, res, next) => {
  let populate = [
    {
      path: "movement",
      select: "name"
    },
    {
      path: "proyect",
      select: "cover name ",
    },
    {
      path: "relation"
    },
    {
      path: "from.user",
      select: "name imgUrl google.imgUrl emails phones username",
      
    }
  ];
  let select = "-user";
  let helper = queryHelper({ ...req.query, user: req.user.id }, { populate, select });
  try {
    let notifications = await Notification.paginate(helper.query, helper.options);
    res.send(notifications);
  } catch (err) {
    next(err);
  }
};


 export const getHeaderValues = async (req, res, next) => {
  let query = { receptor: req.user.id, isActive: { $exists: false } };
  try {
    let notifications = await Notification.countDocuments({user: req.params.user, isRead: false});
    let relations = await Relation.countDocuments(query);

    res.send({
      notifications_n: notifications,
      conexionRequests_n: relations
    });
  } catch (err) {
    next(err);
  }
};


export const setRead = async (req, res, next) => {
  try {
    let notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: req.params.isRead === "true" ? true : false }, { new: true }).lean();
    res.send(notification);
  } catch (err) {
    next(err);
  }
};
