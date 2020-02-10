import { Router } from "express";
const router = Router();
import { main } from "../controllers/report";
import { sToken } from "../config/lib/auth";
router.use(sToken);
router.get("/", main);

export default router;
