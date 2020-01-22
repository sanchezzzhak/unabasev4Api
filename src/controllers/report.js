import User from "../models/user";
import Movement from "../models/movement";
import Business from "../models/business";
import Lines from "../models/line";

export const main = async (req, res, next) => {
  const users = await User.countDocuments({ isActive: true }).exec();
  const movements = await Movement.countDocuments({ isActive: true }).exec();
  const lines = await Lines.countDocuments({ isActive: true, isParent: false }).exec();
  const businesses = await Business.countDocuments({ isActive: true }).exec();
  res.send({ users, movements, lines, businesses });
};
