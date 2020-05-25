import { Router } from "express";
import { isAuth } from "../config/lib/auth";
import logger from "../lib/logger";
import { validateParams } from "../middleware/validate";
import { get, getOne, updateOne, create, find, getRandomSections } from "../controllers/section";
let module = "section";

const router = Router();

router.get("/", get);
router.get("/random/:n",
validateParams(
  [
    {
      param_key: "n",
      required: true,
      type: "string"
    }
  ],
  "params"
),
getRandomSections);

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
