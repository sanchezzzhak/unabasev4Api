import ntype from "normalize-type";

export const parseQueryUrl = (req, res, next) => {
  try {
    req.query = ntype(req.query);
  } catch (err) {
    console.log(err);
  }
  next();
};
