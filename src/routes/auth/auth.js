const express = require("express");
const auth = express.Router();
const ctl = require("./controller");

const passport = require("passport");
/*
{
	get--/ list of  = require('../controllers/user')
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
auth.post("/signup", ctl.signup);

// auth.get("/nouser", ctl.nouser);
// auth.get("/wrong", ctl.wrong);
// auth.get("/inactive", ctl.inactive);
auth.get("/errUser", ctl.errUser);

// auth.post(
//   "/login",
//   passport.authenticate("local-login", {
//     successRedirect: "/",
//     failureRedirect: "/auth/login",
//     failureFlash: true
//   })
// );
auth.post("/login", (req, res, next) => {
  passport.authenticate("local-login", function(err, user, info) {
    console.log(err);
    console.log(user);
    console.log(info);

    if (err) {
      return next(err);
    }
    if (!user) {
      res.statusMessage = info.msg;
      res.status(info.code).end();
      // return res.redirect(info.code, "/");
    } else {
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.redirect("/isAuth");
      });
    }
  })(req, res, next);
});

// auth.get('/login', (req, res,next)=>{
//   console.log(req.msg)
//   // console.log(data)
//   console.log(next)
//   res.send(req.msg)
// })
auth.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/calendar",
      "openid"
    ]
  })
);
auth.get(
  "/google/callback",
  passport.authenticate("google", {}),
  ctl.googleCallback
);

// auth.post('/login', ctl.login)

// auth.post('/connect/local', ctl.connectLocal)
// auth.post('/connect/google', ctl.connectGoogle)

module.exports = auth;
