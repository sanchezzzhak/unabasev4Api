import Empresa from "../models/empresa";
import { queryHelper } from "../lib/queryHelper";

export const get = (req, res, next) => {
  let helper = queryHelper(req.query, {}, ["razon_social"]);
  Empresa.paginate(helper.query, helper.options, (err, empresas) => {
    if (err) next(err);
    res.send(empresas);
  });
};
export const getOne = (req, res, next) => {
  // let query;
  // if (/^\d+$/.test(req.params.q)) {
  //   query = { rut: req.params.q.length === 8 ? req.params.q : req.params.q.slice(0, 8) };
  // } else {
  //   query = { razon_social: { $regex: req.params.q, $options: "i" } };
  // }
  Empresa.findOne({ rut: parseInt(req.params.q) }).exec((err, empresa) => {
    if (err) next(err);
    res.send(empresa || { msg: "business not found" });
  });
};
