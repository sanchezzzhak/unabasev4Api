import { Router } from "express";
const router = Router();
import { subscribe, pushTest } from "../controllers/push";
import { validateParams } from "../middleware/validate";
import { isAuth } from "../config/lib/auth";
import { detector } from "../middleware/device";

router.post(
  "/subscribe",
  validateParams(
    [
      {
        param_key: "subscription",
        required: true,
        type: "object"
      }
    ],
    "body"
  ),
  detector,
  subscribe
);
router.post(
  "/test",
  validateParams(
    [
      {
        param_key: "title",
        required: true,
        type: "string"
      },
      {
        param_key: "text",
        required: true,
        type: "string"
      }
    ],
    "body"
  ),
  pushTest
);

export default router;
