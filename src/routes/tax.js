import { Router } from "express";
const router = Router();
import { get, getOne, create, updateOne, find, deleteOne } from "../controllers/tax";

router.get("/", get);
// router.get('/', filter)
router.get("/:id", getOne);
router.post("/", create);
router.put("/:id", updateOne);
router.get("/find/:q", find);
router.delete("/:id", deleteOne);

export default router;
