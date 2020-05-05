import { Router } from "express";
import { isAuth } from "../config/lib/auth";
import { validateParams } from "../middleware/validate";
import { create, deleteOne, get, stateChange, deleteAll, getOne, getAccepted, getByState, disconnect, getByUser } from "../controllers/relation";

const router = Router();

const module = "relation";

router.get("/", get);
// router.get("/accepted", getAccepted); DEPRECATED
router.get("/state/:state", getByState);
router.get(
  "/user/:user",
  validateParams(
    [
      {
        param_key: "user",
        required: true,
        type: "objectid"
      }
    ],
    "params"
  ),
  getByUser
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
router.post(
  "/",
  validateParams(
    [
      {
        param_key: "receptor",
        required: true,
        type: "string"
      }
    ],
    "body"
  ),
  create
);
router.delete(
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
  deleteOne
);

router.delete(
  "/disconnect/:user",
  validateParams(
    [
      {
        param_key: "user",
        required: true,
        type: "objectid"
      }
    ],
    "params"
  ),
  disconnect
);
router.delete("/", deleteAll);
router.put(
  "/state",
  validateParams(
    [
      {
        param_key: "petitioner",
        required: true,
        type: "string"
      },
      {
        param_key: "isActive",
        required: true,
        type: "boolean"
      }
    ],
    "body"
  ),
  stateChange
);

export default router;
