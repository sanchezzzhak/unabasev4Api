import Relation from "../models/relation";

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
