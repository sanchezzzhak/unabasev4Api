import Log from '../models/log';

export default data => (req, res, next) => {
  let log = new Log();
  Object.assign(log, data);
  log.user = req.user._id;
  let ipHeader = req.headers['x-forwarded-for'];
  let idx = ipHeader.lastIndexOf(',');
  idx > 0 ? (log.ip = ipHeader.slice(0, idx)) : (log.ip = ipHeader);

  log.userAgent = req.get('User-Agent');

  log.save();
  next();
};
