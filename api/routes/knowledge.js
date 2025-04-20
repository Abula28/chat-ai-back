import { Router } from "express";
import { getAllSystemPrompts } from "../controllers/adminController.js";

const router = Router();
router.get("/", getAllSystemPrompts);

export default router;
