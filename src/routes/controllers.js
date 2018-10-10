import bool from 'normalize-bool';
import ntype from 'normalize-type';
const controllers = {
  get({ req, res, modelName, model }) {
    let rquery = ntype(req.query);
    let options = {};
    options.page = rquery.page || 1;
    options.limit = rquery.limit || 20;
    delete rquery.page;
    delete rquery.limit;
    let query = { ...rquery };
    // query.name = req.query.name || null;
    // query.isActive = bool(req.query.active) || null;

    eval(model).paginate(query, options, (err, item) => {
      if (err) {
        res.status(500).end();
      } else {
        res.send(item);
      }
    });
  }
};

export default controllers;
