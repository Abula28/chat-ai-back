import express from "express";
import { body, param } from "express-validator";
import {
  getAllSessions,
  getSessionDetails,
  getSystemPrompt,
  updateSystemPrompt,
  createSystemPrompt,
} from "../controllers/adminController.js";
import { checkAuth, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/sessions", checkAuth, isAdmin, getAllSessions);

router.get(
  "/sessions/:id",
  checkAuth,
  isAdmin,
  param("id").isMongoId(),
  getSessionDetails
);

router.get("/knowledge", checkAuth, isAdmin, getSystemPrompt);

router.post("/prompt", checkAuth, isAdmin, createSystemPrompt);

router.post(
  "/prompt/:id",
  checkAuth,
  isAdmin,
  body("content").notEmpty(),
  updateSystemPrompt
);

export default router;
