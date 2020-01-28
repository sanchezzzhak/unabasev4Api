import User from "../models/user";
import Movement from "../models/movement";
import Business from "../models/business";
import Lines from "../models/line";

export const main = async (req, res, next) => {
  // const users = await User.countDocuments({ isActive: true }).exec();
  const users = {
    total: await User.countDocuments({ isActive: true }).exec(),
    byYear: {
      2019: await User.countDocuments({ createdAt: { $gte: new Date(2019, 0, 1), $lte: new Date(2019, 11, 31) } }).exec(),
      2020: await User.countDocuments({ createdAt: { $gte: new Date(2020, 0, 1), $lte: new Date(2020, 11, 31) } }).exec()
    },
    byMonth: {
      2019: {},
      2020: {}
    }
  };
  for (let i = 0; i < 12; i++) {
    users.byMonth[2019][i + 1] = await User.countDocuments({ createdAt: { $gte: new Date(2019, i, 1), $lte: new Date(2019, i, 31) } }).exec();
    users.byMonth[2020][i + 1] = await User.countDocuments({ createdAt: { $gte: new Date(2020, i, 1), $lte: new Date(2020, i, 31) } }).exec();
  }
  const movements = {
    total: await Movement.countDocuments({ isActive: true }).exec(),
    opportunities: await Movement.countDocuments({ isActive: true, state: "opportunity" }).exec(),
    budgets: await Movement.countDocuments({ isActive: true, state: "budget" }).exec(),
    businesses: await Movement.countDocuments({ isActive: true, state: "business" }).exec()
  };
  const lines = await Lines.countDocuments({ isParent: false }).exec();
  const businesses = await Business.countDocuments({ isActive: true }).exec();
  res.send({ users, movements, lines, businesses });
};
