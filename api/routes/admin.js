import express from "express";
import { body, param } from "express-validator";
import {
  getAllSessions,
  updateSystemPrompt,
  createSystemPrompt,
  getAllMessages,
  deleteMessage,
  deleteSession,
  getAllSystemPrompts,
} from "../controllers/adminController.js";
import { checkAuth, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/messages", checkAuth, isAdmin, getAllMessages);
router.delete("/message/:id", checkAuth, isAdmin, deleteMessage);

router.get("/sessions", checkAuth, isAdmin, getAllSessions);
router.delete("/session/:id", checkAuth, isAdmin, deleteSession);

router.get("/prompts", checkAuth, isAdmin, getAllSystemPrompts);
router.post("/prompt", checkAuth, isAdmin, createSystemPrompt);

router.put(
  "/prompt/:id",
  checkAuth,
  isAdmin,
  body("content").notEmpty(),
  updateSystemPrompt
);

export default router;
