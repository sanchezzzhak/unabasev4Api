import UserPermission from "../models/userPermission";

export const checkPermission = data => (req, res, next) => {
  if (req.user.scope.type === "business") {
    data.user = req.user._id;
    data.business = req.user.scope.id;
    // UserPermission.findOne({ user: req.user._id, business: req.user.scope.id})
    UserPermission.findByPermission(data, (err, userPermission) => {
      if (userPermission) {
        next();
      } else {
        console.log(err);
        res.status(403).end();
      }
    });
  } else {
    next();
  }
};
