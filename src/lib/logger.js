import Log from '../models/log';

export default data => (req, res, next) => {
  let log = new Log();
  Object.assign(log, data);
  if (typeof req.user !== 'undefined') {
    log.user = req.user._id;
  }
  let ipHeader = req.headers['x-forwarded-for'];
  console.log('ipHeader');
  console.log(typeof ipHeader);
  console.log(ipHeader);

  if (typeof ipHeader !== 'undefined') {
    let idx = ipHeader.toString().IndexOf(',');
    idx > 0 ? (log.ip = ipHeader.slice(0, idx)) : (log.ip = ipHeader);
  }
  log.userAgent = req.get('User-Agent');
  log.query = req.query;
  log.params = req.params;
  log.body = req.body;
  log.save();
  next();
};
