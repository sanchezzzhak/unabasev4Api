import { Router } from "express";
import { sToken } from "../config/lib/auth";
import { validateParams } from "../middleware/validate";
import { create, deleteOne, get, stateChange } from "../controllers/relation";
const router = Router();

const module = "relation";
router.use(sToken);

router.get("/", get);
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
router.put(
  "/state",
  validateParams(
    [
      {
        param_key: "petitioner",
        required: true,
        type: "string"
      }
    ],
    "body"
  ),
  validateParams(
    [
      {
        param_key: "state",
        required: true,
        type: "string"
      }
    ],
    "params"
  ),
  stateChange
);

export default router;
