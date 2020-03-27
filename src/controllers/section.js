import Section from "../models/section";
import User from "../models/user";

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
    let section = await Section.findById(req.params.id)
      .populate([{ path: "users", select: "username name imgUrl google.imgUrl emails phones sections" }])
      .lean();
    let users = await User.find({ sections: { $in: [section._id] }, _id: { $ne: req.user._id.toString() } })
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
