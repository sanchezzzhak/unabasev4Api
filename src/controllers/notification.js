import Notification from "../models/notification";
import { queryHelper } from "../lib/queryHelper";

export const get = async (req, res, next) => {
  let populate = [
    {
      path: "movement",
      select: "name"
    },
    // {
    //   path: "user",
    //   select: "name"
    // },
    {
      path: "from.user",
      select: "name"
    }
  ];
  let select = "-user";
  let helper = queryHelper(req.query, { populate, select });
  try {
    let notifications = await Notification.paginate(helper.query, helper.options);
    res.send(notifications);
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
