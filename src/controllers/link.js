import Link from "../models/link";
import { queryHelper } from "../lib/queryHelper";
import { createError } from "../lib/error";

export const create = async (req, res, next) => {
  let exists = await Link.findOne({ url: req.body.url }, { id: 1 }).lean();
  if (exists) next(createError(409, "Link already exists"));
  let link = new Link({
    ...req.body,
    user: req.user._id.toString()
  });
  try {
    await link.save();
    res.send(link);
  } catch (err) {
    next(err);
  }
};

export const get = async (req, res, next) => {
  let helper = queryHelper(req.query, {});
  try {
    let links = await Link.paginate(helper.query, helper.options).then({});
    res.send(links);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    let link = await Link.findById(req.params.id)
      .populate([
        {
          path: "members.user"
        },
        {
          path: "members.positions"
        }
      ])
      .lean();
    if (!link) next(createError(404, req.lg.document.notFound));
    else res.send(link);
  } catch (err) {
    next(err);
  }
};

export const deleteOne = async (req, res, next) => {
  try {
    await Link.findByIdAndDelete(req.params.id).exec();
    res.send({ success: true });
  } catch (err) {
    next(err);
  }
};

export const updateOne = async (req, res, next) => {
  try {
    let link = await Link.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    res.send(link);
  } catch (err) {
    next(err);
  }
};

export const addMember = async (req, res, next) => {
  try {
    let link = await Link.findById(req.params.id)
      .select("members")
      .exec();
    let member = link.members.find(member => member.user === req.body.user);
    if (member) {
      link = await Link.findOneAndUpdate({ _id: req.params.id, "members.user": member.user }, { $set: { "members.$.positions": req.body.positions } }, { new: true }).exec();
    } else {
      link.members.push({ user: req.body.user, positions: req.body.positions });
      await link.save();
    }
    res.send(link);
  } catch (err) {
    next(err);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    let link = await Link.findOneAndUpdate({ _id: req.params.id }, { $pull: { members: { user: req.body.user } } }, { new: true }).exec();
    res.send(link);
  } catch (err) {
    next(err);
  }
};
