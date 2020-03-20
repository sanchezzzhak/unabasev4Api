import { Router } from "express";
import { getUsername } from "../controllers/user";
const router = Router();
let module = "user";
router.get("/users/profile/:username", getUsername);

export default router;
