import axios from 'axios';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import gauth from '../../config/auth';
import mainConfig from '../../config/main';
import ctl from './controller';
import User from '../../models/user';
const auth = Router();
/*
{
	get--/ list of  
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
auth.post('/register', ctl.register);

// auth.get("/nouser", ctl.nouser);
// auth.get("/wrong", ctl.wrong);
// auth.get("/inactive", ctl.inactive);
auth.get('/errUser', ctl.errUser);

// auth.post(
//   "/login",
//   passport.authenticate("local-login", {
//     successRedirect: "/",
//     failureRedirect: "/auth/login",
//     failureFlash: true
//   })
// );
auth.post('/login', (req, res, next) => {
  passport.authenticate('local-login', function(err, user, info) {
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
        } else {
          const token = jwt.sign({ user: user.getUser() }, mainConfig.mSecret, {
            // expiresIn: 60 * 60 * 24 * 7
            expiresIn: 60 * 60 * 24 * 7
          });
          // res.cookie('access_token', token);
          res.statusMessage = 'authenticated';
          res.json({ token, user: user.getUser() });
        }
        // return res.redirect("/isAuth");
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
auth.post('/google/create', ctl.google.new);
auth.post('/gauth', (req, res) => {
  let url = gauth.endpoint + req.body.token;
  console.log(req.body);

  axios(url)
    .then(data => {
      console.log('data from gauth');
      console.log(data['sub']);
      console.log({
        'google.id': data.data.sub
      });
      User.findOne(
        {
          'google.id': data.data.sub
        },
        (err, user) => {
          if (err || user === null) {
            res.status(404).end();
          } else {
            console.log('user.google');
            console.log(user);
            const token = jwt.sign(
              { user: user.getUser() },
              mainConfig.mSecret
            );
            // res.cookie('access_token', token);
            res.json({ token, user: user.getUser() });
          }
        }
      );
    })
    .catch(err => {
      console.log(err);
      res.status(503).end();
    });
});
auth.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/calendar',
      'openid'
    ]
  })
);
auth.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', function(err, user, info) {
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
        return res.redirect('/isAuth');
      });
    }
  })(req, res, next);
});
// auth.get(
//   "/google/callback",
//   passport.authenticate("google", {}),
//   ctl.googleCallback
// );

// auth.post('/login', ctl.login)

// auth.post('/connect/local', ctl.connectLocal)
// auth.post('/connect/google', ctl.connectGoogle)
export default auth;
