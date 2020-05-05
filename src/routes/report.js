import { Router } from "express";
const router = Router();
import { main } from "../controllers/report";
import { isAuth } from "../config/lib/auth";

router.get("/", main);

export default router;
