import { Router } from "express";
import { getSystemPrompt } from "../controllers/adminController.js";

const router = Router();
router.get("/", getSystemPrompt);

export default router;
