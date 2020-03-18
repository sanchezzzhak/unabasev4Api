import Section from "../models/section";

export const get = async (req, res, next) => {
  try {
    let sections = await Section.paginate({}).then({});
    res.send(sections);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    let section = await Section.findById(req.params.id).lean();
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
