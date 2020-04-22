import { Router } from "express";
import { getUsername, findByEmail } from "../controllers/user";
import { validateParams } from "../middleware/validate";
const router = Router();
let module = "user";
router.get("/users/profile/:username", getUsername);
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
