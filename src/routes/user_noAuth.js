import { Router } from "express";
import { getUsername, findByEmail } from "../controllers/user";
import { validateParams } from "../middleware/validate";
import { isAuthOptional } from "../config/lib/auth";
const router = Router();
let module = "user";

router.use(isAuthOptional);

router.get(
  "/users/profile/:username",
  validateParams(
    [
      {
        param_key: "username",
        required: false,
        type: "string"
      }
    ],
    "params"
  ),
  getUsername
);
router.get(
  "/users/find/email/:email",
  validateParams(
    [
      {
        param_key: "email",
        required: false,
        type: "string"
      }
    ],
    "params"
  ),
  findByEmail
);

export default router;
