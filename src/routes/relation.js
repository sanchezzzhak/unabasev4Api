import { Router } from "express";
import { sToken } from "../config/lib/auth";
import { validateParams } from "../middleware/validate";
import { create, deleteOne, get, stateChange, deleteAll, getOne, getAccepted } from "../controllers/relation";
const router = Router();

const module = "relation";
router.use(sToken);

router.get("/", get);
router.get("/accepted", getAccepted);
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
