const { log } = console;
let Permission = require("../../models/permission");
let Logger = require("../../models/logger");
let User = require("../../models/user");
const CircularJSON = require("circular-json");
let taskModel = require("../../models/task");
let Task = taskModel["task"];
module.exports.checkAccess = (id, errorMsg) => {
  return (req, res, next) => {
    let allowed = req.user.permission.find(obj => {
      return obj.scope === req.user.activeScope;
    });
    if (typeof allowed != "undefined") {
      Permission.findOne({ id: id }, (err, permission) => {
        if (err) {
          console.log(err);
        } else {
          if (allowed.ids.indexOf(permission.id) >= 0) {
            next();
          } else {
            req.flash("warning", errorMsg);
            console.log("no posee permisos");
            res.redirect(req.get("referer"));
          }
        }
      });
    } else {
      console.log("no trabaja en la empresa");
      req.flash("warning", errorMsg);
      res.redirect(req.get("referer"));
    }

    // }
    // next()
  };
};

module.exports.isAuth = (req, res, next) => {
  let guestId;
  let invite;
  let update;
  if (typeof req.query.guestId != "undefined") {
    guestId = req.query.guestId;
    invite = req.query.invite;
    update = { $addToSet: { "relations.related": invite } };
    User.findOneAndUpdate({ _id: guestId }, update, (err, user) => {
      if (err) return log(err);
      log("register related");
    });
    update = { $addToSet: { "relations.related": guestId } };
    User.findOneAndUpdate({ _id: invite }, update, (err, user) => {
      if (err) return log(err);
      log("register related");
    });
    update = {
      $addToSet: { participants: { _id: req.query.invite } }
    };
    Task.findOneAndUpdate({ _id: req.query.task }, update, {}, (err, task) => {
      if (err) log(err);
      // res.send(task);
    });
  }
  if (typeof req.query.queryUserId != "undefined") {
    update = {
      $set: { "history.emailUrl": req._parsedOriginalUrl.pathname }
    };
    User.findOneAndUpdate({ _id: req.query.queryUserId }, update, { new: true }, (err, user) => {
      if (err) log(err);
    });
  }
  if (req.isAuthenticated()) {
    // console.log('authenticated');
    return next();
  }
  // console.log('no esta authenticated');
  res.redirect("/auth/login");
  // res.send(JSON.parse(CircularJSON.stringify(req)))
};

module.exports.logger = logItem => {
  return (req, res, next) => {
    // log('req.body')
    // log(req.body)
    let idx = req.ip.lastIndexOf(":");
    let clientIp = req.ip.substring(idx + 1, req.ip.length);
    let newLog = Logger();
    newLog.name = logItem.name || null;
    newLog.module = logItem.module || null;
    newLog.description = logItem.description || null;
    newLog.doc = logItem.doc || null;
    newLog.user = req.user._id || null;
    newLog.owner = req.user.activeScope || null;
    newLog.ip = clientIp || null;
    newLog.userAgent = req.get("User-Agent");
    newLog.save();
    next();
  };
};
