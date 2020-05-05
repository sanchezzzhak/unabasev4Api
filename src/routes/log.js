import { Router } from "express";
const router = Router();
import { get, getOne, create, find } from "../controllers/log";

router.get("/", get);
router.get("/:id", getOne);
router.post("/", create);
router.get("/find/:q", find);

export default router;
