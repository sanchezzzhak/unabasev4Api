import Notification from "../models/notification";
import { queryHelper } from "../lib/queryHelper";

export const get = async (req, res, next) => {
  let populate = [
    {
      path: "movement",
      select: "name"
    },
    {
      path: "user",
      select: "name"
    }
  ];
  let helper = queryHelper(req.query, { populate });
  try {
    let notifications = await Notification.paginate(helper.query, helper.options);
    res.send(notifications);
  } catch (err) {
    next(err);
  }
};

export const setRead = async (req, res, next) => {
  try {
    let notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: req.params.isRead === "true" ? true : false }).lean();
    res.send(notification);
  } catch (err) {
    next(err);
  }
};
