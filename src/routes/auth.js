import { Router } from "express";

import { verify, register, password, login, google, googleCallback, errUser, refreshToken } from "../controllers/auth";

import logger from "../lib/logger";
import { validateParams } from "../middleware/validate";

import passport from "passport";
const auth = Router();
let module = "auth";
/*
{
	get--/ list of  
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
auth.get("/", (req, res, next) => {
  res.send({ msg: "ok" });
});
auth.post("/", (req, res, next) => {
  res.send({ msg: "post ok" });
});
auth.put(
  "/verify/:id",
  logger({
    name: "verify",
    description: "verify a user with local strategy",
    module
  }),
  validateParams(
    [
      {
        param_key: "id",
        required: true,
        type: "string"
      }
    ],
    "params"
  ),
  verify
);

auth.post(
  "/register",
  logger({
    name: "register",
    description: "register a user with local strategy",
    module
  }),
  validateParams(
    [
      {
        param_key: "email",
        required: true,
        type: "string"
      }
    ],
    "body"
  ),
  register
);

auth.post(
  "/password/:id",
  logger({
    name: "restart password",
    description: "restart a password",
    module
  }),
  validateParams(
    [
      {
        param_key: "id",
        required: true,
        type: "string"
      }
    ],
    "params"
  ),
  password
);

// auth.get('/errUser', errUser);

auth.post(
  "/refresh",
  logger({
    name: "refresh",
    description: "refresh a token",
    module
  }),
  validateParams(
    [
      {
        param_key: "refresh_token",
        required: true,
        type: "string"
      }
    ],
    "body"
  ),
  refreshToken
);
auth.post(
  "/login",
  logger({
    name: "login",
    description: "login a user with local strategy",
    module
  }),
  validateParams(
    [
      {
        param_key: "username",
        required: true,
        type: "string"
      },
      {
        param_key: "password",
        required: true,
        type: "string"
      }
    ],
    "body"
  ),
  login
);

auth.post("/login2", passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login2" }));

auth.get("/google", passport.authenticate("google", { scope: ["profile", "email", "openid", "https://www.googleapis.com/auth/calendar.events"] }));

auth.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login2" }), function (req, res) {
  // Successful authentication, redirect home.
  res.redirect("/");
});

// auth.post('/google/register', google.register);
auth.post("/google", google);
export default auth;
