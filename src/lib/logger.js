import Log from '../models/log';

export default data => (req, res, next) => {
  let log = new Log();
  Object.assign(log, data);
  log.user = req.user._id;
  let idx = req.ip.lastIndexOf(':');
  log.ip = req.ip.substring(idx + 1, req.ip.length);
  log.userAgent = req.get('User-Agent');
  console.log('req headers');
  console.log(req.headers);
  console.log('req.connection');
  console.log(req.connection);
  console.log('req.ip');
  console.log(req.ip);
  log.save();
  next();
};
