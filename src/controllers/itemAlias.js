import ItemAlias from "../models/itemAlias";

export const get = async (req, res, next) => {
  try {
    let itemAlias = await ItemAlias.paginate({ creator: req.user.id }).lean();
    res.send(itemAlias);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    let itemAlias = await ItemAlias.findById(req.params.id).lean();
    res.send(itemAlias);
  } catch (err) {
    next(err);
  }
};

export const updateOne = async (req, res, next) => {
  try {
    let itemAlias = await ItemAlias.findByIdAndUpdate(req.params.id, req.body).lean();
    res.send(itemAlias);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    let itemAlias = new ItemAlias(req.body);
    itemAlias.creator = req.user.id;
    await itemAlias.save();
    res.send(itemAlias);
  } catch (err) {
    next(err);
  }
};
