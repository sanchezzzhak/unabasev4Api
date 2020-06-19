import { Router } from "express";
import { get, setRead, getHeaderValues } from "../controllers/notification";
import { validateParams } from "../middleware/validate";
import { isAuth } from "../config/lib/auth";

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

router.get("/header/:user", getHeaderValues);

export default router;
