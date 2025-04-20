import { Router } from "express";
import { login, register, userCheckIn } from "../controllers/authController.js";
import { checkAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check-in", checkAuth, userCheckIn);

export default router;
