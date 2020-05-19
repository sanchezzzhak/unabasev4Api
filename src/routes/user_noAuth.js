import { Router } from "express";
import { getUsername, findByEmail } from "../controllers/user";
import { validateParams } from "../middleware/validate";
import { isAuthOptional } from "../config/lib/auth";
const router = Router();
let module = "user";

router.get(
    "/users/profile/:username",
    isAuthOptional,
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
    isAuthOptional,
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
