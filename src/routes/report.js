import { Router } from "express";
const router = Router();
import { main } from "../controllers/report";

router.get("/", main);

export default router;
