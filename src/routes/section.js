import { Router } from "express";
import { sToken } from "../config/lib/auth";
import logger from "../lib/logger";
import { validateParams } from "../middleware/validate";
import { get, getOne, updateOne, create, find } from "../controllers/section";
let module = "section";

const router = Router();
router.use(sToken);

router.get("/", get);
router.get(
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

router.post(
  "/",
  validateParams(
    [
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

export default router;
