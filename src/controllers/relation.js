import Relation from "../models/relation";
import { queryHelper } from "../lib/queryHelper";
import { sendPush } from "../lib/push";
import Notification from "../models/notification";
import User from "../models/user";
import { createError } from "../lib/error";

export const create = async (req, res, next) => {
  let exists = await Relation.findOne(
    {
      petitioner: req.user.id,
      receptor: req.body.receptor
    },
    { id: 1 }
  ).lean();
  if (exists) next(createError(409, "Relations already exists"));
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
    let title = `${req.user.name.first} ${req.user.name.second || ""} te ha enviado una solicitud de conexión`;
    let notification = new Notification({
      title,
      user: user._id.toString(),
      // movement: movement._id.toString(),
      link,
      from: {
        user: req.user._id.toString()
      },
      relation: relation._id
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
    let relation = await Relation.findOneAndUpdate({ receptor: req.user.id, petitioner: req.body.petitioner }, { isActive: req.body.isActive }, { new: true }).lean();
    let petitioner = await User.findById(req.body.petitioner)
      .select("name webpush")
      .lean();
    let title = `${req.user.name.first} ${req.user.name.second || ""} ha ${req.body.isActive ? "aceptado" : "rechazado"} tu solicitud de conexión`;
    let notification = new Notification({
      title,
      user: petitioner._id.toString(),
      // movement: movement._id.toString(),
      link: "",
      from: {
        user: req.user.id
      },
      relation: relation._id
    });
    await notification.save();
    sendPush(
      {
        title,
        link: ""
      },
      petitioner
    );
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
          select: "name imgUrl google.imgUrl emails phones"
        },
        {
          path: "petitioner",
          select: "name imgUrl google.imgUrl emails phones address otherAccounts sections",

          populate: {
            path: "sections"
          }
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
      select: "name imgUrl google.imgUrl emails phones"
    },
    {
      path: "petitioner",
      select: "name imgUrl google.imgUrl emails phones"
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

// TODO DEPRECATED
export const getAccepted = async (req, res, next) => {
  let populate = [
    {
      path: "receptor",
      select: "name imgUrl google.imgUrl emails phones sections",
      populate: {
        path: "sections"
      }
    },
    {
      path: "petitioner",
      select: "name imgUrl google.imgUrl emails phones sections",
      populate: {
        path: "sections"
      }
    }
  ];
  let helper = queryHelper(req.query, { populate });
  try {
    let relations = await Relation.paginate({ $or: [{ petitioner: req.user.id }, { receptor: req.user.id }], isActive: true }, helper.options).then({});
    res.send(relations);
  } catch (err) {
    next(err);
  }
};
export const getByState = async (req, res, next) => {
  let state;
  switch (req.params.state) {
    case "accepted":
      state = { isActive: true };
      break;
    case "rejected":
      state = { isActive: false };
      break;
    case "pending":
      state = { isActive: { $exists: false } };
      break;
  }
  let populate = [
    {
      path: "receptor",
      select: "name imgUrl google.imgUrl emails phones sections",
      populate: {
        path: "sections"
      }
    },
    {
      path: "petitioner",
      select: "name imgUrl google.imgUrl emails phones sections",
      populate: {
        path: "sections"
      }
    }
  ];
  let helper = queryHelper(req.query, { populate });
  try {
    let relations = await Relation.paginate({ $or: [{ petitioner: req.user.id }, { receptor: req.user.id }], ...state }, helper.options).then({});
    res.send(relations);
  } catch (err) {
    next(err);
  }
};
