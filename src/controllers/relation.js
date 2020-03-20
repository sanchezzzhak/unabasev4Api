import Relation from "../models/relation";
import { queryHelper } from "../lib/queryHelper";
import { sendPush } from "../lib/push";
import Notification from "../models/notification";
import User from "../models/user";

export const create = async (req, res, next) => {
  let relation = new Relation({
    petitioner: req.user.id,
    receptor: req.body.receptor
  });
  try {
    await relation.save();
    let user = await User.findById(req.body.receptor)
      .select("name webpush")
      .lean();
    let link = ``;
    console.log(req.user);
    let title = `${req.user.name.first} ${req.user.name.second} te ha enviado una solicitud de conexión`;
    let notification = new Notification({
      title,
      user: user._id.toString(),
      // movement: movement._id.toString(),
      link,
      from: {
        user: req.user._id.toString()
      }
    });
    await notification.save();
    sendPush(
      {
        title,
        link
      },
      user
    );
    res.send(relation);
  } catch (err) {
    next(err);
  }
};
export const stateChange = async (req, res, next) => {
  try {
    let relation = await Relation.findOneAndUpdate({ receptor: req.user.id, petitioner: req.body.petitioner, isActive: req.body.state }).exec();
    res.send(relation);
  } catch (err) {
    next(err);
  }
};
export const deleteOne = async (req, res, next) => {
  try {
    await Relation.findByIdAndDelete(req.params.id).exec();
    res.send({ success: true });
  } catch (err) {
    next(err);
  }
};
export const deleteAll = async (req, res, next) => {
  try {
    await Relation.deleteMany({ receptor: req.user.id }).exec();
    res.send({ success: true });
  } catch (err) {
    next(err);
  }
};
export const getOne = async (req, res, next) => {
  try {
    let relation = await Relation.findById(req.params.id)
      .populate([
        {
          path: "receptor",
          select: "name"
        },
        {
          path: "petitioner",
          select: "name"
        }
      ])
      .lean();
    res.send(relation);
  } catch (err) {
    next(err);
  }
};
export const get = async (req, res, next) => {
  let populate = [
    {
      path: "receptor",
      select: "name"
    },
    {
      path: "petitioner",
      select: "name"
    }
  ];
  let helper = queryHelper(req.query, { populate });
  try {
    let relations = await Relation.paginate(helper.query, helper.options).then({});
    res.send(relations);
  } catch (err) {
    next(err);
  }
};
