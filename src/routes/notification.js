import { Router } from "express";
import { get, setRead } from "../controllers/notification";
import { validateParams } from "../middleware/validate";
import { sToken } from "../config/lib/auth";

const router = Router();
router.use(sToken);

router.get("/", get);
router.put(
  "/:id/:isRead",

  validateParams(
    [
      {
        param_key: "id",
        required: true,
        type: "string"
      },
      {
        param_key: "isRead",
        required: true,
        type: "string"
      }
    ],
    "params"
  ),
  setRead
);

export default router;
