import ntype from "normalize-type";

export const parseQueryUrl = (req, res, next) => {
  try {
    req.query = ntype(req.query);
  } catch (err) {
    logy(err);
  }
  next();
};
