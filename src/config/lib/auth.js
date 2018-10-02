module.exports = {
  cToken(req, res, next) {
    req.token = req.cookies.access_token;
    console.log("req.cookies");
    console.log(req.cookies);
    console.log(req.token);
    if (typeof req.token !== "undefined") {
      next();
    } else {
      res.sendStatus(403);
    }
  },
  sToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    console.log("req.headers");
    console.log(req.headers);
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      req.token = bearer[1];
      next();
    } else {
      res.sendStatus(403);
    }
  },
  isAuth(req, res, next) {
    // if (req.session.user) {
    //   next();
    // } else {
    //   res.sendStatus(403);
    // }
    console.log("req.isAuthenticated()");
    console.log(req.isAuthenticated());
    console.log(req.user);
    console.log(req.cookies);
    if (req.isAuthenticated() || req.method === "OPTIONS") {
      // if (req.isAuthenticated()) {
      next();
    } else {
      res.sendStatus(403);
    }
  }
};
