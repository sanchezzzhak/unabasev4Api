import { Router } from "express";
const router = Router();
import { get, getOne, find, updateOne, create, findSelf, byItem } from "../controllers/contact";

router.post("/", create);
router.get("/", get);
router.get("/self/:q", findSelf);
router.get("/self", findSelf);
router.get("/find/:q", find);
router.get("/:id", getOne);
router.put("/:id", updateOne);
router.get("/item/:id", byItem);

export default router;
