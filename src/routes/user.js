import { Router } from "express";
const users = Router();
import { validateParams } from "../middleware/validate";
import { create, get, logout, find, getOne, password, update, business, scope, user, restart, relationsFind, lastItems, lastParents } from "../controllers/user";

import { sToken } from "../config/lib/auth";
users.post("/", create);
users.use(sToken);

/*
{
	get--/ 
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/
users.put(
  "/password",
  validateParams(
    [
      {
        param_key: "password",
        required: false,
        type: "string"
      },
      {
        param_key: "newPassword",
        required: true,
        type: "string"
      }
    ],
    "body"
  ),
  password
);

users.get("/", get);
users.get("/lastItems", lastItems);
users.get("/lastParents", lastParents);
users.get("/logout", logout);
users.get(
  "/find/:q",
  validateParams(
    [
      {
        param_key: "q",
        required: true,
        type: "string"
      }
    ],
    "params"
  ),
  find
);
users.get(
  "/relations/:q",
  validateParams(
    [
      {
        param_key: "q",
        required: true,
        type: "string"
      }
    ],
    "params"
  ),
  relationsFind
);
users.get(
  "/:id",
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
  getOne
);
users.post(
  "/restart/:q",
  validateParams(
    [
      {
        param_key: "q",
        required: true,
        type: "string"
      }
    ],
    "params"
  ),
  restart
);
users.put(
  "/business/:id",
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
  validateParams(
    [
      {
        param_key: "business",
        required: true,
        type: "string"
      }
    ],
    "body"
  ),
  business
);
users.put(
  "/user/:id",
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
  validateParams(
    [
      {
        param_key: "user",
        required: true,
        type: "string"
      }
    ],
    "body"
  ),
  user
);
users.put(
  "/scope/:id",
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
  validateParams(
    [
      {
        param_key: "type",
        required: true,
        type: "string"
      },
      {
        param_key: "id",
        required: true,
        type: "string"
      }
    ],
    "body"
  ),
  scope
);
users.put(
  "/:id",
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
  validateParams(
    [
      {
        param_key: "name",
        required: false,
        type: "string"
      }
    ],
    "body"
  ),
  update
);

export default users;
