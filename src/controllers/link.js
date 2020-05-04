import Link from "../models/link";
import Relation from "../models/relation";
import { queryHelper } from "../lib/queryHelper";
import { createError } from "../lib/error";

export const create = async (req, res, next) => {
  // let exists = await Link.findOne({ url: req.body.url }, { id: 1 }).lean();
  // if (exists) next(createError(409, "Link already exists"));
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
export const getByMember = async (req, res, next) => {
  let select = "name imgUrl google.imgUrl emails phones address otherAccounts sections";
  try {
    let links = await Link.paginate(
      // get member with main true
      { members: { $elemMatch: { $and: [{ user: req.params.member }, { main: false }] } } },
      { populate: [{ path: "user", select }, { path: "members.user", select }, { path: "members.positions" }, { path: "contact" }], sort: "-createdAt" }
    ).then({});
    res.send(links);
  } catch (err) {
    next(err);
  }
};

export const getByUser = async (req, res, next) => {
  let select = "name imgUrl google.imgUrl emails phones address otherAccounts sections";
  try {
    let links = await Link.paginate(
      { $or: [{ user: req.params.user }, { members: { $elemMatch: { user: req.params.user, main: true } } }] },
      { populate: [{ path: "user", select }, { path: "members.user", select }, { path: "members.positions" }, { path: "contact" }], sort: "-createdAt" }
    ).then({});
    res.send(links);
  } catch (err) {
    next(err);
  }
};
export const getOne = async (req, res, next) => {
  let select = "username name imgUrl google.imgUrl emails phones address otherAccounts sections";
  let link;
  try {
    link = await Link.findById(req.params.id)
      .populate([
        {
          path: "members.user",
          select,
          populate: [{ path: "sections", select: "name isActive" }]
        },
        {
          path: "members.positions",
          select
        }
      ])
      .lean();
    if (!link) next(createError(404, req.lg.document.notFound));
    else {
      for await (let member of link.members) {
        let relation = await Relation.findOne(
          {
            $or: [
              { petitioner: member.user._id, receptor: req.user._id },
              { petitioner: req.user._id, receptor: member.user._id }
            ],
            isActive: true
          },
          { isActive: true }
        ).lean();
        let index = link.members.findIndex(m => m.user._id === member.user._id);
        link.members[index].relation = relation;
      }
      res.send(link);
    }
  } catch (err) {
    next(err);
  }
};
export const getRelated = async (req, res, next) => {
  try {
    let select = "name imgUrl google.imgUrl emails phones address otherAccounts sections";
    let relations = await Relation.find({ $or: [{ petitioner: req.user.id }, { receptor: req.user.id }], isActive: true }, { petitioner: 1, receptor: 1 }).lean();
    let users = relations.map(relation => (relation.petitioner === req.user.id ? relation.receptor : relation.petitioner));
    let links = await Link.find({ $or: [{ "members.user": { $in: users } }, { user: { $in: users } }] })
      .sort({ createdAt: -1 })
      .populate([{ path: "members.user", select }, { path: "members.positions" }, { path: "user", select, populate: [{ path: "sections" }] }])
      .lean();
    res.send(links);
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

export const setMain = async (req, res, next) => {
  try {
    let link = await Link.findOneAndUpdate({ _id: req.body.id, "members.user": req.user._id }, { $set: { "members.$.main": req.body.main } }, { new: true }).lean();
    res.send(link);
  } catch (err) {
    next(err);
  }
};
export const addMember = async (req, res, next) => {
  try {
    let link = await Link.findById(req.params.id).select("members").exec();
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

export const find = async (req, res, next) => {
  let query = {
    $or: [
      {
        description: {
          $regex: req.params.q,
          $options: "i"
        }
      },
      {
        name: {
          $regex: req.params.q,
          $options: "i"
        }
      }
    ]
  };

  try {
    let links = await Link.paginate(query).then({});
    res.send(links);
  } catch (err) {
    next(err);
  }
};
