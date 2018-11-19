import Line from '../models/line';

export function get(req, res) {
  let rquery = ntype(req.query);
  let options = {};
  options.page = rquery.page || 1;
  options.limit = rquery.limit || 20;

  options.populate = [{ path: 'tax' }, { path: 'item' }];
  delete rquery.page;
  delete rquery.limit;
  let query = {
    ...rquery
  };
  console.log('query');
  console.log(query);
  Line.paginate(query, options, (err, items) => {
    if (err) {
      res.status(500).end();
    } else {
      res.json(items);
    }
  });
}
export function create(req, res) {
  let line = new Line(req.body);
  line.save((err, item) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(item);
    }
  });
}

export function updateOne(req, res) {
  Line.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, item) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.send(item);
      }
    }
  );
}
