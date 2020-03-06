import { Router } from "express";
import { get, setRead } from "../controllers/notification";
import { validateParams } from "../middleware/validate";
import { sToken } from "../config/lib/auth";
currencies.use(sToken);

const router = Router();

router.get("/", get);
router.put(
  "/read/:id/:isRead",

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
