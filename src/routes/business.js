import { Router } from "express";
const router = Router();
import { get, gets, create, getOne, updateOne, user, addUserToBusiness } from "../controllers/business";

import { validateParams } from "../middleware/validate";

router.get("/", get);
router.post(
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
router.get(
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
router.put(
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
router.put(
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
// router.put('/addUser/:id', addUserToBusiness);
// router

export default router;
