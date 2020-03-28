import Section from "../models/section";
import User from "../models/user";
import Realtion from "../models/Realtion";

export const get = async (req, res, next) => {
  try {
    let sections = await Section.paginate({}, { populate: [{ path: "users", select: "name" }] }).then({});
    res.send(sections);
  } catch (err) {
    next(err);
  }
};
export const find = async (req, res, next) => {
  try {
    let sections = await Section.paginate({ name: { $regex: req.params.q, $options: "i" } }, { select: "name" }).then({});
    res.send(sections);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    // find the selection by the id pass in params
    let section = await Section.findById(req.params.id)
      .populate([{ path: "users", select: "username name imgUrl google.imgUrl emails phones sections" }])
      .lean();
    // find relations active for the current user
    let relations = await Relation.find({ $or: [{ petitioner: req.user._id.toString() }, { receptor: req.user._id.toString() }], isActive: true }).lean();
    // fill an array with the receptors filtering the current user
    let receptors = relations.map(relation => relation.receptor);
    receptors = receptors.filter(receptor !== req.user._id.toString());
    // fill an array with the petitioners filtering the current user
    let petitioners = relations.map(relation => relation.petitioner);
    petitioners = petitioners.filter(petitioner !== req.user._id.toString());
    // find users with the sections and that have a relation with the current user
    let users = await User.find({
      $and: [{ sections: { $in: [section._id] }, _id: { $ne: req.user._id.toString() } }, { $or: [{ _id: { $in: petitioners } }, { _id: { $in: receptors } }] }]
    })
      .select("username name imgUrl google.imgUrl emails phones sections")
      .lean();
    section.users = users;
    res.send(section);
  } catch (err) {
    next(err);
  }
};

export const updateOne = async (req, res, next) => {
  try {
    let section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    res.send(section);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    let section = new Section(req.body);
    await section.save();
    res.send(section);
  } catch (err) {
    next(err);
  }
};
