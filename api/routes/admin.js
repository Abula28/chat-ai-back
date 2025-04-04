import express from "express";
import { body, param } from "express-validator";
import {
  isAdmin,
  getAllSessions,
  getSessionDetails,
  getSystemPrompt,
  updateSystemPrompt,
} from "../controllers/adminController.js";

const router = express.Router();

// Get all sessions
router.get("/sessions", isAdmin, getAllSessions);

// Get specific session messages
router.get(
  "/sessions/:id",
  isAdmin,
  param("id").isMongoId(),
  getSessionDetails
);

// Get current system prompt
router.get("/knowledge", isAdmin, getSystemPrompt);

// Update system prompt
router.post("/prompt", isAdmin, body("content").notEmpty(), updateSystemPrompt);

export default router;
