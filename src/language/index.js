import user from "./user";
import item from "./item";
export default (req, res, next) => {
  const locale = req.user?.language || req.locale?.language || "es";
  // if (typeof req.user !== "undefined") {
  //   req.lg = languages[req.user.language || "es"];
  // } else if (req.locale.language) {
  //   req.lg = languages[req.locale.language || "es"];
  // } else {
  //   req.lg = languages["es"];
  // }
  req.lg = { user, item };
  next();
};
