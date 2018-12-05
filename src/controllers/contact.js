const routes = {
  get: (req, res) => {
    let rquery = ntype(req.query);
    let options = {};
    options.page = rquery.page || 1;
    options.limit = rquery.limit || 20;
    delete rquery.page;
    delete rquery.limit;
  },
  getOne: (req, res) => {},
  create: (req, res) => {},
  find: (req, res) => {},
  updateOne: (req, res) => {}
};
