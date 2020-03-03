import { Router } from "express";
const router = Router();
import { subscribe, pushTest } from "../controllers/push";
import { validateParams } from "../middleware/validate";
import { sToken } from "../config/lib/auth";

router.use(sToken);
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
