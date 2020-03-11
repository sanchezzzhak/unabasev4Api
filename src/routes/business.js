import { Router } from "express";
const business = Router();
import { get, gets, create, getOne, updateOne, user, addUserToBusiness } from "../controllers/business";
import { sToken } from "../config/lib/auth";
import { validateParams } from "../middleware/validate";

business.use(sToken);
business.get("/", get);
business.post(
  "/",
  validateParams(
    [
      {
        param_key: "idNumber",
        required: true,
        type: "string"
      },
      {
        param_key: "name",
        required: true,
        type: "string"
      }
    ],
    "body"
  ),
  create
);
business.get(
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
business.put(
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
  updateOne
);
business.put(
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
      },
      {
        param_key: "action",
        required: true,
        type: "string"
      }
    ],
    "body"
  ),
  user
);

// HECTOR - RUTA QUE AGREGA UN USUARIO A UNA EMPRESA
// business.put('/addUser/:id', addUserToBusiness);
// business

export default business;
