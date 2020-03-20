import Relation from "../models/relation";
import { queryHelper } from "../lib/queryHelper";

export const create = async (req, res, next) => {
  let relation = new Relation({
    petitioner: req.user.id,
    receptor: req.body.receptor
  });
  try {
    await relation.save();
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
export const getOne = (req, res, next) => {
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
      res.send(relation)
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
